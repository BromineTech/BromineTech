const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
    // Pool settings
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 30, // Idle timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
});

// dbConfig.js
module.exports = sql;