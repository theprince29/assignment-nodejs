const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

// SQL query to create the "schools" table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
`;

// Execute the query to ensure the table is created
(async () => {
  try {
    console.log('[INFO]: Checking for the existence of the "schools" table...');
    await pool.query(createTableQuery);
    console.log('[INFO]: Table "schools" is ready.');
  } catch (err) {
    console.error('[ERROR]: Error creating table:', err.message);
  }
})();


module.exports = pool;
