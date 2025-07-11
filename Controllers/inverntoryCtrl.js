import xlsx from 'xlsx';
import path from 'path';
import { pool } from "../Config/dbConnect.js";
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Google Auth setup using service account JSON key
const serviceAccountJson = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8')
);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountJson,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});


export const syncInventory = async () => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1lJvsemtVUkpRUmwd7MCvnHshNZqaz6Dem0myA3ylvPw',
    range: 'Sheet1!A2:AD', // Adjust if needed
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('❗ No data found in Google Sheet.');
    return;
  }
  for (const row of rows) {
    const [
      sourceName, // A
      stock,         // B
      manu1,         // C
      manu2,         // D
      invoice,       // E
      payment,       // F
      pmtStatus,     // G 
      payTerms,      // H
      vin,           // I
      engine,        // J
      key,           // K
      bl,            // L
      shipDate,      // M
      brand,         // N
      ocnSpec,       // O
      model,         // P
      country,       // Q
      myYear,        // R
      extColor,      // S
      intColor,      // T
      tbd3,          // U
      orderMonth,    // V
      prodEst,       // W
      shipEst,       // X
      estArr,        // Y
      shpDte,        // Z
      arrEst,        // AA
      arrDate,       // AB
      shipIndication // AC
    ] = row;
    const cleanDate = (d) => {
      // convert to yyyy-mm-dd or return NULL
      const parsed = new Date(d);
      return isNaN(parsed) ? null : parsed.toISOString().split('T')[0];
    };
    await pool.query(`
  INSERT INTO inventory 
  (SourceName, STOCK, MANU1, MANU2, INVOICE, PAYMENT, PMTSTATUS, PAYTERMS, VIN, ENGINE, \`KEY\`, BL, SHIPDATE, BRAND, OCNSPEC, MODEL, COUNTRY, MYYEAR, EXTCOLOR, INTCOLOR, TBD3, ORDERMONTH, PRODEST, SHIPEST, ESTARR, SHPDTE, ARREST, ARRDATE, SHIPINDICATION) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    SourceName = VALUES(SourceName),
    MANU1 = VALUES(MANU1),
    MANU2 = VALUES(MANU2),
    INVOICE = VALUES(INVOICE),
    PAYMENT = VALUES(PAYMENT),
    PMTSTATUS = VALUES(PMTSTATUS),
    PAYTERMS = VALUES(PAYTERMS),
    VIN = VALUES(VIN),
    ENGINE = VALUES(ENGINE),
    \`KEY\` = VALUES(\`KEY\`),
    BL = VALUES(BL),
    SHIPDATE = VALUES(SHIPDATE),
    BRAND = VALUES(BRAND),
    OCNSPEC = VALUES(OCNSPEC),
    MODEL = VALUES(MODEL),
    COUNTRY = VALUES(COUNTRY),
    MYYEAR = VALUES(MYYEAR),
    EXTCOLOR = VALUES(EXTCOLOR),
    INTCOLOR = VALUES(INTCOLOR),
    TBD3 = VALUES(TBD3),
    ORDERMONTH = VALUES(ORDERMONTH),
    PRODEST = VALUES(PRODEST),
    SHIPEST = VALUES(SHIPEST),
    ESTARR = VALUES(ESTARR),
    SHPDTE = VALUES(SHPDTE),
    ARREST = VALUES(ARREST),
    ARRDATE = VALUES(ARRDATE),
    SHIPINDICATION = VALUES(SHIPINDICATION)
`, [
      sourceName, stock, manu1, manu2, invoice, payment, pmtStatus, payTerms, vin, engine, key, bl,
      cleanDate(shipDate), brand, ocnSpec, model, country, myYear, extColor, intColor, tbd3, orderMonth,
      prodEst, shipEst, estArr, cleanDate(shpDte), arrEst, cleanDate(arrDate), shipIndication
    ]);
  }
  console.log('✅ Inventory synced and replaced from Google Sheet.');
};

export const getAllCountries = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT COUNTRY FROM inventory
      WHERE COUNTRY IS NOT NULL AND COUNTRY != ''
    `);
    const countryList = rows.map(row => row.COUNTRY);
    // Return object with "brand" key
    res.json({ country: countryList });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllBrands = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT BRAND FROM inventory
      WHERE BRAND IS NOT NULL AND BRAND != ''
    `);

    // Extract brand names
    const brandList = rows.map(row => row.BRAND);

    // Return object with "brand" key
    res.json({ brand: brandList });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// export const getAllstatus = async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT DISTINCT SHIPINDICATION FROM inventory
//       WHERE SHIPINDICATION IS NOT NULL AND SHIPINDICATION != ''
//     `);

//     // Just return an array of country values
//     const shipingList = rows.map(row => row.SHIPINDICATION);

//     res.json(shipingList);
//   } catch (error) {
//     console.error('Error fetching countries:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



export const getAllDropdownFilters = async (req, res) => {
  try {
    const [countriesRows] = await pool.query(`
      SELECT DISTINCT COUNTRY FROM inventory
      WHERE COUNTRY IS NOT NULL AND COUNTRY != ''
    `);

    const [brandsRows] = await pool.query(`
      SELECT DISTINCT BRAND FROM inventory
      WHERE BRAND IS NOT NULL AND BRAND != ''
    `);

    const [statusRows] = await pool.query(`
      SELECT DISTINCT SHIPINDICATION FROM inventory
      WHERE SHIPINDICATION IS NOT NULL AND SHIPINDICATION != ''
    `);

    const response = {
      countries: countriesRows.map(row => row.COUNTRY),
      brands: brandsRows.map(row => row.BRAND),
      statuses: statusRows.map(row => row.SHIPINDICATION),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};







export const getInventory = async (req, res) => {
  try {
    const [inventorys] = await pool.query('SELECT * FROM inventory');
    res.json(inventorys);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error });
  }
};

export const addInventory = async (req, res) => {
  try {
    const { id, SourceName, STOCK, MANU1, MANU2, INVOICE, PAYMENT, PMTSTATUS, PAYTERMS, VIN, ENGINE, KEY, BL, SHIPDATE, BRAND, OCNSPEC, MODEL, COUNTRY, MYYEAR, EXTCOLOR, INTCOLOR, TBD3, ORDERMONTH, PRODEST, SHIPEST, ESTARR, SHPDTE, ARREST, ARRDATE, SHIPINDICATION } = req.body;

    const mysqlQuery = `INSERT INTO inventory (id,SourceName,STOCK,MANU1,MANU2,INVOICE,PAYMENT,PMTSTATUS,PAYTERMS,VIN,ENGINE,\`KEY\`,BL,SHIPDATE,BRAND,OCNSPEC,MODEL,COUNTRY,MYYEAR,EXTCOLOR,INTCOLOR,TBD3,ORDERMONTH,PRODEST,SHIPEST,ESTARR,SHPDTE,ARREST,ARRDATE,SHIPINDICATION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.query(mysqlQuery, [id, SourceName, STOCK, MANU1, MANU2, INVOICE, PAYMENT, PMTSTATUS, PAYTERMS, VIN, ENGINE, KEY, BL, SHIPDATE, BRAND, OCNSPEC, MODEL, COUNTRY, MYYEAR, EXTCOLOR, INTCOLOR, TBD3, ORDERMONTH, PRODEST, SHIPEST, ESTARR, SHPDTE, ARREST, ARRDATE, SHIPINDICATION]);

    const [rows] = await pool.query(`SELECT * FROM inventory WHERE id = ?`, [result.insertId]);

    return res.status(201).json({
      message: "Inventory submitted successfully",
      data: rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// export const uploadInventory = async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//         const filePath = path.join(req.file.destination, req.file.filename);
//         const workbook = xlsx.readFile(filePath);
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const data = xlsx.utils.sheet_to_json(sheet);

//         const insertPromises = data.map(async (row) => {
//             const sql = `INSERT INTO inventory ( id,SourceName,STOCK,MANU1,MANU2,INVOICE,PAYMENT,PMTSTATUS,PAYTERMS,VIN,ENGINE,\`KEY\`,BL,SHIPDATE,BRAND,OCNSPEC,MODEL,COUNTRY,MYYEAR,EXTCOLOR,INTCOLOR,TBD3,ORDERMONTH,PRODEST,SHIPEST,ESTARR,SHPDTE,ARREST,ARRDATE, SHIPINDICATION ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//             await pool.query(sql, [
//                 row.id || null,
//                 row.SourceName || '',
//                 row.STOCK || '',
//                 row.MANU1 || '',
//                 row.MANU2 || '',
//                 row.INVOICE || '',
//                 row.PAYMENT || '',
//                 row.PMTSTATUS || '',
//                 row.PAYTERMS || '',
//                 row.VIN || '',
//                 row.ENGINE || '',
//                 row.KEY || '',
//                 row.BL || '',
//                 row.SHIPDATE || null,
//                 row.BRAND || '',
//                 row.OCNSPEC || '',
//                 row.MODEL || '',
//                 row.COUNTRY || '',
//                 row.MYYEAR || '',
//                 row.EXTCOLOR || '',
//                 row.INTCOLOR || '',
//                 row.TBD3 || '',
//                 row.ORDERMONTH || '',
//                 row.PRODEST || '',
//                 row.SHIPEST || '',
//                 row.ESTARR || '',
//                 row.SHPDTE || null,
//                 row.ARREST || '',
//                 row.ARRDATE || null,
//                 row.SHIPINDICATION || '',
//             ]);
//         });

//         await Promise.all(insertPromises);

//         res.status(200).json({ message: 'Inventory uploaded and saved successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error processing inventory', error: error.message });
//     }
// };





// Controller function
export const uploadInventory = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const filePath = path.join(req.file.destination, req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, {
      header: [
        'Source.Name', 'STOCK #', 'MANU#', 'MANU#2', 'INVOICE#', 'PAYMENT', 'PMT STATUS', 'PAY. TERMS',
        'VIN#', 'ENGINE#', 'KEY#', 'BL#', 'SHIP DATE', 'BRAND', 'OCN SPEC', 'MODEL', 'COUNTRY', 'MY YEAR',
        'EXT. COLOR', 'INT. COLOR', 'TBD3', 'ORDER MONTH', 'PROD. EST', 'SHIP. EST', 'EST ARR', 'SHP DTE',
        'ARR EST', 'ARR. DATE', 'SHIP INDICATION'
      ],
      range: 1
    });
    const insertPromises = data.map(async (row) => {
      const sql = `INSERT INTO inventory ( id,SourceName,STOCK,MANU1,MANU2,INVOICE,PAYMENT,PMTSTATUS,PAYTERMS,VIN,ENGINE,\`KEY\`,BL,SHIPDATE,BRAND,OCNSPEC,MODEL,COUNTRY,MYYEAR,EXTCOLOR,INTCOLOR,TBD3,ORDERMONTH,PRODEST,SHIPEST,ESTARR,SHPDTE,ARREST,ARRDATE,SHIPINDICATION ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await pool.query(sql, [
        null,
        row['Source.Name'] || '',
        row['STOCK #'] || '',
        row['MANU#'] || '',
        row['MANU#2'] || '',
        row['INVOICE#'] || '',
        row['PAYMENT'] || '',
        row['PMT STATUS'] || '',
        row['PAY. TERMS'] || '',
        row['VIN#'] || '',
        row['ENGINE#'] || '',
        row['KEY#'] || '',
        row['BL#'] || '',
        row['SHIP DATE'] || null,
        row['BRAND'] || '',
        row['OCN SPEC'] || '',
        row['MODEL'] || '',
        row['COUNTRY'] || '',
        row['MY YEAR'] || '',
        row['EXT. COLOR'] || '',
        row['INT. COLOR'] || '',
        row['TBD3'] || '',
        row['ORDER MONTH'] || '',
        row['PROD. EST'] || '',
        row['SHIP. EST'] || '',
        row['EST ARR'] || '',
        row['SHP DTE'] || null,
        row['ARR EST'] || '',
        row['ARR. DATE'] || null,
        row['SHIP INDICATION'] || '',
      ]);
    });
    await Promise.all(insertPromises);
    res.status(200).json({ message: 'Inventory uploaded and saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing inventory', error: error.message });
  }
};
// Route setup (add this to your router file)
// import express from 'express';
// const router = express.Router();
// router.post('/upload', upload.single('inventoryFile'), uploadInventory);
// export default router;
// import { google } from 'googleapis';
// import mysql from 'mysql2/promise';
// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     type: 'service_account',
//     project_id: 'dealership-464311',
//     private_key_id: '93144c7707e1ac06b194c9acfc2cfe7e1013c2fd',
//     private_key: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`,
//     client_email: 'dealership@dealership-464311.iam.gserviceaccount.com',
//   },
//   scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
// });
// const sheets = google.sheets({ version: 'v4', auth });
// const spreadsheetId = 'YOUR_SPREADSHEET_ID';
// export const syncSheetToDB = async () => {
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: 'Sheet1',
//   });
//   const rows = response.data.values;
//   const connection = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'your_password',
//     database: 'your_db',
//   });
//   for (let i = 1; i < rows.length; i++) {
//     const row = rows[i];
//     await connection.query('INSERT INTO inventory (sourceName, stockNumber) VALUES (?, ?)', [
//       row[0], row[1]
//     ]);
//   }
//   await connection.end();
// };

// UPDATE INVENTORY
export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    SHIPINDICATION
    const [result] = await pool.query(
      `UPDATE inventory SET SourceName=?, STOCK=?, MANU1=?, MANU2=?, INVOICE=?, PAYMENT=?, PMTSTATUS=?, PAYTERMS=?, ` +
      `VIN=?, ENGINE=?, \`KEY\`=?, BL=?, SHIPDATE=?, BRAND=?, OCNSPEC=?, MODEL=?, COUNTRY=?, MYYEAR=?, EXTCOLOR=?, INTCOLOR=?, ` +
      `TBD3=?, ORDERMONTH=?, PRODEST=?, SHIPEST=?, ESTARR=?, SHPDTE=?, ARREST=?, ARRDATE=?, SHIPINDICATION=? WHERE id=?`,
      [
        data.sourceName, data.STOCK, data.MANU1, data.MANU2, data.INVOICE, data.PAYMENT, data.PMTSTATUS, data.PAYTERMS,
        data.VIN, data.ENGINE, data.KEY, data.BL, data.SHIPDATE, data.BRAND, data.OCNSPEC, data.MODEL, data.COUNTRY,
        data.MYYEAR, data.EXTCOLOR, data.INTCOLOR, data.TBD3, data.ORDERMONTH, data.PRODEST, data.SHIPEST, data.ESTARR,
        data.SHPDTE, data.ARREST, data.ARRDATE, data.SHIPINDICATION, id
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Inventory not found' });
    res.json({ msg: 'Inventory updated' });
  } catch (error) {
    res.status(500).json({ msg: 'Error updating inventory', error });
  }
};

// DELETE INVENTORY
export const DeleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM inventory WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Inventory not found' });
    res.json({ msg: 'Inventory deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting inventory', error });
  }
};

// GET USER BY ID 
export const getInventoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [inventorys] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
    if (inventorys.length === 0) return res.status(404).json({ msg: 'inventorys not found' });
    res.json(inventorys[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user', error });
  }
};

export const getInventoryBybycountry = async (req, res) => {
  const { COUNTRY } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM inventory WHERE COUNTRY = ?', [COUNTRY]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// export const getInventoryBypagination = async (req, res) => {
//     try {
//         // Get page and limit from query parameters, set defaults if not provided
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         // Calculate offset
//         const offset = (page - 1) * limit;

//         // Query to get paginated data
//         const [inventory] = await pool.query(
//             'SELECT * FROM inventory LIMIT ? OFFSET ?',
//             [limit, offset]
//         );

//         // Get total count of inventory items
//         const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM inventory');
//         const total = countResult[0].total;
//         const totalPages = Math.ceil(total / limit);

//         res.json({
//             currentPage: page,
//             totalPages,
//             totalRecords: total,
//             data: inventory
//         });

//     } catch (error) {
//         console.error('Error fetching inventory:', error);
//         res.status(500).json({ msg: 'Error fetching inventory', error });
//     }
// };


export const getInventoryBypagination = async (req, res) => {
  try {
    // Step 1: Parse query params with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max limit = 100
    const offset = (page - 1) * limit;

    // Step 2: Optional sort (e.g., by ID descending)
    const [inventory] = await pool.query(
      'SELECT * FROM inventory ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Step 3: Get total records
    const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM inventory');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Step 4: Return paginated response
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalRecords: total,
      data: inventory
    });

  } catch (error) {
    console.error('❌ Error fetching inventory:', error);
    res.status(500).json({ message: 'Error fetching inventory', error });
  }
};

