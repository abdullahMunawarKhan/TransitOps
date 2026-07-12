# TransitOps - Smart Transport Operations Platform

TransitOps is an end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management while enforcing strict business rules and providing real-time operational insights. 

It aims to replace spreadsheets and manual logbooks by providing a centralized system to manage the complete lifecycle of logistics and transport operations.

## 🚀 Key Features & Functionalities

### 1. Authentication & Role-Based Access Control (RBAC)
- Secure login and session management.
- Custom interfaces and permissions based on user roles:
  - **Fleet Manager**: Oversees fleet assets, maintenance, vehicle lifecycle, and efficiency.
  - **Driver**: Monitors active deliveries and manages assigned trips.
  - **Safety Officer**: Tracks driver compliance, license validity, and safety scores.
  - **Financial Analyst**: Reviews operational expenses, fuel consumption, maintenance costs, and profitability.

### 2. Interactive Dashboard
- Real-time Key Performance Indicators (KPIs): Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers On Duty, and Fleet Utilization.
- Advanced filtering by vehicle type, status, and geographic region.

### 3. Vehicle Registry
- Centralized master list for vehicle tracking.
- Captures unique Registration Numbers, Name/Model, Type, Maximum Load Capacity, Odometer, and Acquisition Cost.
- **Automated Status Syncing**: Vehicle statuses (`Available`, `On Trip`, `In Shop`, `Retired`) are dynamically updated based on active trips and maintenance logs.

### 4. Driver Management
- Driver profiles including License Number, License Category, Expiry Date, Contact Info, and Safety Score.
- **Automated Status Syncing**: Driver statuses (`Available`, `On Trip`, `Off Duty`, `Suspended`) are dynamically updated when dispatched for trips.

### 5. Smart Trip Management
- Create trips by selecting a source, destination, available vehicle, available driver, cargo weight, and planned distance.
- **Trip Lifecycle Tracking**: Draft ➔ Dispatched ➔ Completed ➔ Cancelled.
- **Mandatory Business Rules Enforcement**:
  - Validates that cargo weight does not exceed the vehicle's maximum load capacity.
  - Prevents dispatching vehicles that are `Retired` or `In Shop`.
  - Prevents assigning drivers with expired licenses or `Suspended` status.
  - Automatically updates both driver and vehicle status to `On Trip` upon dispatch and restores them to `Available` upon completion or cancellation.

### 6. Maintenance Workflow
- Comprehensive maintenance log generation.
- **Automated Status Switching**: Creating an active maintenance record automatically marks the vehicle as `In Shop`, removing it from the driver's dispatch selection pool. Closing the maintenance restores it to `Available`.

### 7. Fuel & Expense Management
- Record fuel logs (liters, cost, date).
- Log additional operational expenses such as tolls, parking, and fines.
- Automatically compute total operational cost (Fuel + Maintenance) per vehicle.

### 8. Reports & Analytics
- Data-driven insights focusing on:
  - **Fuel Efficiency**: Distance traveled per fuel volume.
  - **Fleet Utilization**: Percentage of active vehicles versus total fleet.
  - **Vehicle ROI**: Derived using `[Revenue - (Maintenance + Fuel)] / Acquisition Cost`.
- Supports exporting reports to CSV and PDF formats.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend as a Service (BaaS)**: Supabase
- **Database**: PostgreSQL (Leveraging triggers and RPCs for automated business logic and data integrity)
- **Deployment**: Vercel (Configured via `vercel.json`)

## 📦 Setup & Installation

1. Clone the repository and navigate into the directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema
A complete PostgreSQL database schema implementation (including tables, foreign keys, triggers, and RPCs) is available in [`db.sql`](./db.sql). It can be directly executed in your Supabase SQL Editor to provision the required tables and logic.
