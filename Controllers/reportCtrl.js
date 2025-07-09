import ExcelJS from "exceljs";
import { pool } from "../Config/dbConnect.js";

export const generateReport = async (req, res) => {
  const { report_type, from_date, to_date, dealership_id } = req.body;

  let query = "";
  let values = [];

  switch (report_type) {
    case "orders":
      query = `
        SELECT o.*, d.name as dealership_name 
        FROM orders o 
        JOIN dealership d ON o.dealership_id = d.id 
        WHERE o.order_date BETWEEN ? AND ?
      `;
      values = [from_date, to_date];
      if (dealership_id !== "all") {
        query += " AND o.dealership_id = ?";
        values.push(dealership_id);
      }
      break;

    case "inventory":
      query = `
        SELECT i.*, d.name as dealership_name 
        FROM inventory i 
        JOIN dealership d ON i.dealership_id = d.id 
        WHERE i.arrival_date BETWEEN ? AND ?
      `;
      values = [from_date, to_date];
      if (dealership_id !== "all") {
        query += " AND i.dealership_id = ?";
        values.push(dealership_id);
      }
      break;

    case "sales":
      query = `
        SELECT s.*, d.name as dealership_name 
        FROM sales s 
        JOIN dealership d ON s.dealership_id = d.id 
        WHERE s.sale_date BETWEEN ? AND ?
      `;
      values = [from_date, to_date];
      if (dealership_id !== "all") {
        query += " AND s.dealership_id = ?";
        values.push(dealership_id);
      }
      break;

    case "financial":
      query = `
        SELECT f.*, d.name as dealership_name 
        FROM financial f 
        JOIN dealership d ON f.dealership_id = d.id 
        WHERE f.date BETWEEN ? AND ?
      `;
      values = [from_date, to_date];
      if (dealership_id !== "all") {
        query += " AND f.dealership_id = ?";
        values.push(dealership_id);
      }
      break;

    default:
      return res.status(400).json({ message: "Invalid report type" });
  }

  try {
    const [results] = await pool.execute(query, values);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${report_type} Report`);

    // Add headers
    worksheet.columns = Object.keys(results[0] || {}).map((key) => ({
      header: key,
      key,
      width: 20,
    }));

    // Add rows
    results.forEach((row) => worksheet.addRow(row));

    // Set Excel file name
    const today = new Date().toISOString().slice(0, 10);
    const fileName = `${report_type}-report-${today}.xlsx`;
    // ✅ Save to local disk for testing
    await workbook.xlsx.writeFile(`./test-report.xlsx`);
    console.log(`✅ File saved locally as test-report.xlsx`);
    // ✅ Stream the Excel file to frontend
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("❌ Report generation error:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};
