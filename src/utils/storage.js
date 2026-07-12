/**
 * TransitOps Centralized Storage Layer
 * All entity reads/writes for Safety Officer and Financial Analyst modules
 * go through these functions so a future Supabase swap touches one file.
 *
 * Keys used (pulled from actual code in DriversView, FleetView, Dispatcher):
 *   'transitops.drivers'
 *   'transitops.vehicles'
 *   'transitops.trips'
 *   'transitops.users'
 *   'transitops.revenue'   ← new, owned by Financial Analyst module
 *
 * Auth token ('supabase.auth.token') is intentionally NOT here — it is
 * managed by App.jsx > getCurrentUser() only.
 */

// ─── Drivers ─────────────────────────────────────────────────────────────────

export const getDrivers = () => {
  try {
    const stored = localStorage.getItem('transitops.drivers');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveDrivers = (drivers) => {
  localStorage.setItem('transitops.drivers', JSON.stringify(drivers));
};

/**
 * Update a single driver by licenseNumber.
 * Merges updatedFields into the matching driver object.
 * Returns the updated drivers array.
 */
export const updateDriver = (licenseNumber, updatedFields) => {
  const drivers = getDrivers();
  const updated = drivers.map((d) =>
    d.licenseNumber === licenseNumber ? { ...d, ...updatedFields } : d
  );
  saveDrivers(updated);
  return updated;
};

// ─── Vehicles ────────────────────────────────────────────────────────────────

export const getVehicles = () => {
  try {
    const stored = localStorage.getItem('transitops.vehicles');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveVehicles = (vehicles) => {
  localStorage.setItem('transitops.vehicles', JSON.stringify(vehicles));
};

/**
 * Update a single vehicle by regNumber.
 * Merges updatedFields into the matching vehicle object.
 * Returns the updated vehicles array.
 */
export const updateVehicle = (regNumber, updatedFields) => {
  const vehicles = getVehicles();
  const updated = vehicles.map((v) =>
    v.regNumber === regNumber ? { ...v, ...updatedFields } : v
  );
  saveVehicles(updated);
  return updated;
};

// ─── Trips ───────────────────────────────────────────────────────────────────

export const getTrips = () => {
  try {
    const stored = localStorage.getItem('transitops.trips');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveTrips = (trips) => {
  localStorage.setItem('transitops.trips', JSON.stringify(trips));
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const getUsers = () => {
  try {
    const stored = localStorage.getItem('transitops.users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem('transitops.users', JSON.stringify(users));
};

// ─── Revenue Entries ─────────────────────────────────────────────────────────
// Join key: RevenueEntry.vehicleId === Vehicle.regNumber (e.g. 'TX-1042-CS')
// Do NOT use vehicle name — regNumber is the stable unique key.

export const getRevenueEntries = () => {
  try {
    const stored = localStorage.getItem('transitops.revenue');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveRevenueEntries = (entries) => {
  localStorage.setItem('transitops.revenue', JSON.stringify(entries));
};

/**
 * Append a single revenue entry.
 * entry shape: { id, vehicleId (regNumber), vehicleName, amount (number), date, note }
 */
export const addRevenueEntry = (entry) => {
  const entries = getRevenueEntries();
  const updated = [entry, ...entries];
  saveRevenueEntries(updated);
  return updated;
};

export const deleteRevenueEntry = (id) => {
  const entries = getRevenueEntries();
  const updated = entries.filter((e) => e.id !== id);
  saveRevenueEntries(updated);
  return updated;
};
