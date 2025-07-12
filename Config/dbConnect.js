// import { JSONCookie } from 'cookie-parser';
// import { query } from 'express';
// import mysql from 'mysql2/promise';
// export const pool = mysql.createPool({
//   host: "shuttle.proxy.rlwy.net",             // ✅ Updated host
//   port: 26669,                                 // ✅ Updated port
//   user: "root",                                // ✅ Username
//   password: "yLDcGETiVjudnqmuKkZnhwUlXUaYvUtx", // ✅ Password
//   database: "railway",                         // ✅ DB name
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000,
// });
// (async () => {
//   try { 
//     const connection = await pool.getConnection();
//     console.log("✅ Local Dealership database connected !!");
//     connection.release();
//   } catch (error) {
//     console.error("❌ Database connection error:", error);
//   }
// })();

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


import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "localhost",    // ✅ Railway host
  port: 3306,                           // ✅ Railway port
  user: "root",                          // ✅ Railway username
  password: "",  // ✅ Railway password
  database: "dealership",                  // ✅ Database name
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
