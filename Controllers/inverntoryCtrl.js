import xlsx from 'xlsx';
import path from 'path';
import { pool } from "../Config/dbConnect.js";





export const addInventory = async (req, res) => {
    try {
        const { id, sourceName, stockNumber, manuNumber, manuNumber2, invoiceNumber, payment, paymentStatus, paymentTerms, vin, engine, keyNumber, bl, shipDate, brand, ocnSpec, model, country, vinYear, extColor, intColor, tbd3, orderMonth, productionEstimate, shipEstimate, estArrival, shippingDate, arrivalEstimate, arrivalDate, shippingIndication } = req.body;

        const mysqlQuery = `INSERT INTO inventory (id, sourceName, stockNumber, manuNumber, manuNumber2, invoiceNumber, payment, paymentStatus, paymentTerms, vin, engine, keyNumber, bl, shipDate, brand, ocnSpec, model, country, vinYear, extColor, intColor, tbd3, orderMonth, productionEstimate, shipEstimate, estArrival, shippingDate, arrivalEstimate, arrivalDate, shippingIndication) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.query(mysqlQuery, [id, sourceName, stockNumber, manuNumber, manuNumber2, invoiceNumber, payment, paymentStatus, paymentTerms, vin, engine, keyNumber, bl, shipDate, brand, ocnSpec, model, country, vinYear, extColor, intColor, tbd3, orderMonth, productionEstimate, shipEstimate, estArrival, shippingDate, arrivalEstimate, arrivalDate, shippingIndication]);

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


export const uploadInventory = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = path.join(req.file.destination, req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const insertPromises = data.map(async (row) => {
      const sql = `INSERT INTO inventory (id, sourceName, stockNumber, manuNumber, manuNumber2, invoiceNumber, payment, paymentStatus, paymentTerms, vin, engine, keyNumber, bl, shipDate, brand, ocnSpec, model, country, vinYear, extColor, intColor, tbd3, orderMonth, productionEstimate, shipEstimate, estArrival, shippingDate, arrivalEstimate, arrivalDate, shippingIndication) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await pool.query(sql, [
        row.id || null,
        row.sourceName || '',
        row.stockNumber || '',
        row.manuNumber || '',
        row.manuNumber2 || '',
        row.invoiceNumber || '',
        row.payment || '',
        row.paymentStatus || '',
        row.paymentTerms || '',
        row.vin || '',
        row.engine || '',
        row.keyNumber || '',
        row.bl || '',
        row.shipDate || null,
        row.brand || '',
        row.ocnSpec || '',
        row.model || '',
        row.country || '',
        row.vinYear || '',
        row.extColor || '',
        row.intColor || '',
        row.tbd3 || '',
        row.orderMonth || '',
        row.productionEstimate || '',
        row.shipEstimate || '',
        row.estArrival || '',
        row.shippingDate || null,
        row.arrivalEstimate || '',
        row.arrivalDate || null,
        row.shippingIndication || '',
      ]);
    });

    await Promise.all(insertPromises);

    res.status(200).json({ message: 'Inventory uploaded and saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing inventory', error: error.message });
  }
};

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
   
        
        const [result] = await pool.query(
            `UPDATE inventory SET sourceName=?, stockNumber=?, manuNumber=?, manuNumber2=?, invoiceNumber=?, payment=?, paymentStatus=?, paymentTerms=?, ` +
            `vin=?, engine=?, \`keyNumber\`=?, bl=?, shipDate=?, brand=?, ocnSpec=?, model=?, country=?, vinYear=?, extColor=?, intColor=?, ` +
            `tbd3=?, orderMonth=?, productionEstimate=?, shipEstimate=?, estArrival=?, shippingDate=?, arrivalEstimate=?, arrivalDate=?, shippingIndication=? WHERE id=?`,
            [
                data.sourceName, data.stockNumber, data.manuNumber, data.manuNumber2, data.invoiceNumber, data.payment, data.paymentStatus, data.paymentTerms,
                data.vin, data.engine, data.keyNumber, data.bl, data.shipDate, data.brand, data.ocnSpec, data.model, data.country,
                data.vinYear, data.extColor, data.intColor, data.tbd3, data.orderMonth, data.productionEstimate, data.shipEstimate, data.estArrival,
                data.shippingDate, data.arrivalEstimate, data.arrivalDate, data.shippingIndication, id
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



// GET ALL USERS 
export const getInventory = async (req, res) => {
    try {
        const [inventorys] = await pool.query('SELECT * FROM inventory');
        res.json(inventorys);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching users', error });
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