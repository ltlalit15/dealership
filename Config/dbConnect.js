// import { JSONCookie } from 'cookie-parser';
// import { query } from 'express';
// import mysql from 'mysql2/promise';
// export const pool = mysql.createPool({
//   host: "trolley.proxy.rlwy.net",      // Updated Host
//   port: 26538,                         // Updated Port
//   user: "root",                       // Username
//   password: "FAkkkyqhMXhErnkoRrcjtLVKobWUMEDF", // Updated Password
//   database: "railway",                // Database Name
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000,
// });
// // Check connection
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("✅ Railway MySQL database connected");
//     connection.release();
//   } catch (error) {
//     console.error("❌ Database connection error:", error);
//   }
// })();


import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "localhost",     // 👈 Localhost for local MySQL
  port: 3306,            // 👈 Default MySQL port
  user: "root",          // 👈 Your local MySQL username
  password: "",          // 👈 Or your local MySQL password
  database: "dealership",                // Database Name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" Local MySQL database connected !!" );
    connection.release();
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();