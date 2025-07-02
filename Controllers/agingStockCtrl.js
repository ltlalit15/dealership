import { pool } from "../Config/dbConnect.js";
import ExcelJS from 'exceljs';
export const createAgingStock = async (req, res) => {
  try {
    const {
      vin,
      model,
      country,
      arrival_date,
      created_by
    } = req.body;
    if (!vin || !model || !country || !arrival_date || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const arrivalDate = new Date(arrival_date);
    const today = new Date();
    const days_in_stock = Math.floor((today - arrivalDate) / (1000 * 60 * 60 * 24));
    const over_six_months = days_in_stock > 180;
    const sql = `
      INSERT INTO aging_stock
      (vin, model, country, arrival_date, days_in_stock, over_six_months, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [vin, model, country, arrival_date, days_in_stock, over_six_months, created_by]);
    res.status(200).json({ message: 'Aging stock record inserted successfully' });
  } catch (error) {
    console.error('Error in createAgingStock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateAgingStock = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vin,
      model,
      country,
      arrival_date,
      created_by
    } = req.body;
    if (!vin || !model || !country || !arrival_date || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const arrivalDate = new Date(arrival_date);
    const today = new Date();
    const days_in_stock = Math.floor((today - arrivalDate) / (1000 * 60 * 60 * 24));
    const over_six_months = days_in_stock > 180;
    const sql = `
      UPDATE aging_stock SET
      vin = ?, model = ?, country = ?, arrival_date = ?, days_in_stock = ?, over_six_months = ?, created_by = ?
      WHERE id = ?
    `;
    await pool.query(sql, [vin, model, country, arrival_date, days_in_stock, over_six_months, created_by, id]);
    res.status(200).json({ message: 'Aging stock updated successfully' });
  } catch (error) {
    console.error('Error updating aging stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAgingStock = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM aging_stock WHERE id = ?`;
    await pool.query(sql, [id]);
    res.status(200).json({ message: 'Aging stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting aging stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAgingStockList = async (req, res) => {
  try {
    const { over_six_months } = req.query; // Optional query param
    let sql = 'SELECT * FROM aging_stock';
    const params = [];
    if (over_six_months === 'true') {
      sql += ' WHERE over_six_months = TRUE';
    } else if (over_six_months === 'false') {
      sql += ' WHERE over_six_months = FALSE';
    }
    const [rows] = await pool.query(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching aging stock list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAgingStockChartData = async (req, res) => {
  try {
    const sql = `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN over_six_months = TRUE THEN 1 ELSE 0 END) AS over_six_months,
        SUM(CASE WHEN over_six_months = FALSE THEN 1 ELSE 0 END) AS under_six_months
      FROM aging_stock
    `;
    const [rows] = await pool.query(sql);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error generating aging stock chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const exportAgingStockToExcel = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM aging_stock');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Aging Stock');
    worksheet.columns = [
      { header: 'VIN', key: 'vin' },
      { header: 'Model', key: 'model' },
      { header: 'Country', key: 'country' },
      { header: 'Arrival Date', key: 'arrival_date' },
      { header: 'Days in Stock', key: 'days_in_stock' },
      { header: 'Over 6 Months', key: 'over_six_months' },
      { header: 'Created By', key: 'created_by' }
    ];
    rows.forEach(row => worksheet.addRow(row));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=aging_stock.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

