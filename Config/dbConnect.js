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

//live db
import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "tramway.proxy.rlwy.net",        // ✅ Updated Railway host
  port: 54419,                            // ✅ Updated Railway port
  user: "root",                           // ✅ Railway username (unchanged)
  password: "CeqMkUwyihatNzHUhkLcEdTlJPpTQznZ", // ✅ Updated Railway password
  database: "railway",                   // ✅ Database name
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
