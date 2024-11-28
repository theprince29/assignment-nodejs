const pool = require('../db/db'); 

// Add School
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4)';
  const values = [name, address, latitude, longitude];

  try {
    await pool.query(query, values);
    res.status(201).json({ message: 'School added successfully.' });
  } catch (err) {
    console.error('[ERROR]: Failed to add school:', err.message);
    res.status(500).json({ message: 'Error adding school.', error: err.message });
  }
};

// List Schools Sorted by Distance
const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  // Validation
  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  const userLatitude = parseFloat(latitude);
  const userLongitude = parseFloat(longitude);

  const query = 'SELECT * FROM schools';

  try {
    const result = await pool.query(query);
    const schools = result.rows;

    // Calculate distances and sort schools
    const schoolsWithDistances = schools.map((school) => ({
      ...school,
      distance: calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude),
    }));

    schoolsWithDistances.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistances);
  } catch (err) {
    console.error('[ERROR]: Failed to fetch schools:', err.message);
    res.status(500).json({ message: 'Error fetching schools.', error: err.message });
  }
};

// Helper function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

module.exports = { addSchool, listSchools };
