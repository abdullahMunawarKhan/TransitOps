-- Enums
CREATE TYPE user_role AS ENUM ('Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst');
CREATE TYPE vehicle_status AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');
CREATE TYPE driver_status AS ENUM ('Available', 'On Trip', 'Off Duty', 'Suspended');
CREATE TYPE trip_status AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');
CREATE TYPE maintenance_status AS ENUM ('Active', 'Completed');

-- Tables
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name user_role UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    name_model VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    max_load_capacity NUMERIC NOT NULL CHECK (max_load_capacity > 0),
    odometer NUMERIC DEFAULT 0,
    acquisition_cost NUMERIC,
    status vehicle_status DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20),
    license_expiry_date DATE NOT NULL,
    contact_number VARCHAR(20),
    safety_score NUMERIC DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
    status driver_status DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id UUID REFERENCES drivers(id) ON DELETE RESTRICT,
    cargo_weight NUMERIC NOT NULL CHECK (cargo_weight >= 0),
    planned_distance NUMERIC NOT NULL CHECK (planned_distance > 0),
    status trip_status DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status maintenance_status DEFAULT 'Active',
    cost NUMERIC DEFAULT 0,
    date_logged DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    liters NUMERIC NOT NULL CHECK (liters > 0),
    cost NUMERIC NOT NULL CHECK (cost >= 0),
    date_logged DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    expense_type VARCHAR(100) NOT NULL, -- e.g., Toll, Fine, Parking
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    date_logged DATE DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vehicles_modtime BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_drivers_modtime BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_trips_modtime BEFORE UPDATE ON trips FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_maintenance_logs_modtime BEFORE UPDATE ON maintenance_logs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Business Rules Implementation (Triggers & Functions)

-- 1. Validate Trip before Dispatch
CREATE OR REPLACE FUNCTION validate_trip_dispatch()
RETURNS TRIGGER AS $$
DECLARE
    v_max_load NUMERIC;
    v_vehicle_status vehicle_status;
    v_driver_status driver_status;
    v_license_expiry DATE;
BEGIN
    -- Only validate when status changes to 'Dispatched'
    IF NEW.status = 'Dispatched' AND (OLD.status IS NULL OR OLD.status != 'Dispatched') THEN
        
        -- Get vehicle details
        SELECT max_load_capacity, status INTO v_max_load, v_vehicle_status
        FROM vehicles WHERE id = NEW.vehicle_id;
        
        -- Get driver details
        SELECT status, license_expiry_date INTO v_driver_status, v_license_expiry
        FROM drivers WHERE id = NEW.driver_id;

        -- Rule: Cargo Weight must not exceed vehicle's maximum load capacity
        IF NEW.cargo_weight > v_max_load THEN
            RAISE EXCEPTION 'Cargo weight (%) exceeds vehicle maximum load capacity (%)', NEW.cargo_weight, v_max_load;
        END IF;

        -- Rule: Retired or In Shop vehicles must never appear in dispatch (Status must be Available)
        IF v_vehicle_status != 'Available' THEN
            RAISE EXCEPTION 'Vehicle is not available for dispatch. Current status: %', v_vehicle_status;
        END IF;

        -- Rule: Drivers with expired licenses or Suspended status cannot be assigned
        IF v_driver_status != 'Available' THEN
            RAISE EXCEPTION 'Driver is not available for dispatch. Current status: %', v_driver_status;
        END IF;

        IF v_license_expiry < CURRENT_DATE THEN
            RAISE EXCEPTION 'Driver license is expired (Expiry Date: %)', v_license_expiry;
        END IF;

    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_trip_validity
BEFORE INSERT OR UPDATE ON trips
FOR EACH ROW EXECUTE PROCEDURE validate_trip_dispatch();

-- 2. Update Vehicle and Driver status on Trip status change
CREATE OR REPLACE FUNCTION handle_trip_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- When dispatched, set to On Trip
    IF NEW.status = 'Dispatched' AND (OLD.status IS NULL OR OLD.status != 'Dispatched') THEN
        UPDATE vehicles SET status = 'On Trip' WHERE id = NEW.vehicle_id;
        UPDATE drivers SET status = 'On Trip' WHERE id = NEW.driver_id;
    END IF;

    -- When completed or cancelled, set to Available
    IF (NEW.status = 'Completed' OR NEW.status = 'Cancelled') AND OLD.status = 'Dispatched' THEN
        UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id AND status = 'On Trip';
        UPDATE drivers SET status = 'Available' WHERE id = NEW.driver_id AND status = 'On Trip';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_entities_on_trip_status
AFTER INSERT OR UPDATE ON trips
FOR EACH ROW EXECUTE PROCEDURE handle_trip_status_change();


-- 3. Maintenance Logic: Creating active maintenance changes vehicle to In Shop
CREATE OR REPLACE FUNCTION handle_maintenance_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_vehicle_status vehicle_status;
BEGIN
    IF NEW.status = 'Active' THEN
        UPDATE vehicles SET status = 'In Shop' WHERE id = NEW.vehicle_id;
    ELSIF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status = 'Active') THEN
        -- Only set back to available if it's not retired
        SELECT status INTO v_vehicle_status FROM vehicles WHERE id = NEW.vehicle_id;
        IF v_vehicle_status != 'Retired' THEN
            UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_on_maintenance
AFTER INSERT OR UPDATE ON maintenance_logs
FOR EACH ROW EXECUTE PROCEDURE handle_maintenance_status_change();

-- 4. RPCs (Remote Procedure Calls for Supabase)

-- RPC to get Fleet Utilization
CREATE OR REPLACE FUNCTION get_fleet_utilization()
RETURNS NUMERIC AS $$
DECLARE
    total_vehicles INT;
    active_vehicles INT;
BEGIN
    SELECT count(*) INTO total_vehicles FROM vehicles WHERE status != 'Retired';
    SELECT count(*) INTO active_vehicles FROM vehicles WHERE status = 'On Trip';
    
    IF total_vehicles = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (active_vehicles::NUMERIC / total_vehicles::NUMERIC) * 100;
END;
$$ LANGUAGE plpgsql;

-- RPC to complete a trip and log fuel/odometer
CREATE OR REPLACE FUNCTION complete_trip_log(
    p_trip_id UUID,
    p_final_odometer NUMERIC,
    p_fuel_consumed NUMERIC,
    p_fuel_cost NUMERIC
)
RETURNS VOID AS $$
DECLARE
    v_vehicle_id UUID;
BEGIN
    -- Get vehicle id
    SELECT vehicle_id INTO v_vehicle_id FROM trips WHERE id = p_trip_id;
    
    IF v_vehicle_id IS NULL THEN
        RAISE EXCEPTION 'Trip not found';
    END IF;

    -- Update vehicle odometer
    UPDATE vehicles SET odometer = p_final_odometer WHERE id = v_vehicle_id;
    
    -- Insert fuel log
    IF p_fuel_consumed > 0 THEN
        INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, date_logged)
        VALUES (v_vehicle_id, p_trip_id, p_fuel_consumed, p_fuel_cost, CURRENT_DATE);
    END IF;
    
    -- Mark trip as completed
    UPDATE trips SET status = 'Completed' WHERE id = p_trip_id;
    
END;
$$ LANGUAGE plpgsql;

-- RPC for Vehicle ROI
CREATE OR REPLACE FUNCTION get_vehicle_roi(p_vehicle_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_acquisition_cost NUMERIC;
    v_maintenance_cost NUMERIC;
    v_fuel_cost NUMERIC;
    v_revenue NUMERIC := 0; -- Replace with actual revenue logic if added later, assuming placeholder
BEGIN
    SELECT acquisition_cost INTO v_acquisition_cost FROM vehicles WHERE id = p_vehicle_id;
    
    IF v_acquisition_cost IS NULL OR v_acquisition_cost = 0 THEN
        RETURN 0;
    END IF;

    SELECT COALESCE(SUM(cost), 0) INTO v_maintenance_cost FROM maintenance_logs WHERE vehicle_id = p_vehicle_id;
    SELECT COALESCE(SUM(cost), 0) INTO v_fuel_cost FROM fuel_logs WHERE vehicle_id = p_vehicle_id;
    
    -- Formula from requirements: [Revenue - (Maintenance + Fuel)] / Acquisition Cost
    RETURN (v_revenue - (v_maintenance_cost + v_fuel_cost)) / v_acquisition_cost;
END;
$$ LANGUAGE plpgsql;
