import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "localhost",      // Updated Host
  port: 3306,                         // Updated Port
  user: "root",                       // Username
  password: "", // Updated Password
  database: "dealership",                // Database Name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});
(async () => {
  try { 
    const connection = await pool.getConnection();
    console.log("✅ Local Dealership database connected !!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();

//live db
// import { JSONCookie } from 'cookie-parser';
// import { query } from 'express';
// import mysql from 'mysql2/promise';
// export const pool = mysql.createPool({
//   host: "shinkansen.proxy.rlwy.net",    // ✅ Railway host
//   port: 58417,                           // ✅ Railway port
//   user: "root",                          // ✅ Railway username
//   password: "vPQMiXLOcsfhbPiZneJgbImgreEJDifE",  // ✅ Railway password
//   database: "railway",                  // ✅ Database name
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000,
// });
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log(" Local MySQL database connected !!" );
//     connection.release();
//   } catch (error) {
//     console.error("❌ Database connection error:", error);
//   }
// })();
