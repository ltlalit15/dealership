
import { pool } from "../Config/dbConnect.js";
export const logActivity = async (req, res) => {
  try {
    const { user_id, dealership_id, action_type, action_details } = req.body;

    if (!user_id || !dealership_id || !action_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const sql = `
      INSERT INTO activity_logs (user_id, dealership_id, action_type, action_details)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(sql, [user_id, dealership_id, action_type, action_details]);
    res.status(200).json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
