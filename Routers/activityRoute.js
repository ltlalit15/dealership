import express from 'express';
import { logActivity } from '../Controllers/activityCtrl.js';

const router = express.Router();

router.post('/log-activity', logActivity);



// POST http://localhost:8000/api/log-activity
// {
//   "user_id": 2,
//   "dealership_id": 1,
//   "action_type": "create_order",
//   "action_details": "Order #1234 created for 5 units"
// }

router.get('/settings/general', async (req, res) => {
  const [settings] = await db.query('SELECT * FROM system_settings LIMIT 1');
  res.json(settings[0]);
});

router.put('/settings/general', async (req, res) => {
  const {
    language, time_zone, currency_format, date_format,
    company_name, tax_number, contact_email, phone_number
  } = req.body;

  await db.query(`
    UPDATE system_settings SET
    language = ?, time_zone = ?, currency_format = ?, date_format = ?,
    company_name = ?, tax_number = ?, contact_email = ?, phone_number = ?
    WHERE id = 1
  `, [language, time_zone, currency_format, date_format, company_name, tax_number, contact_email, phone_number]);

  res.json({ message: 'Settings updated successfully' });
});


export default router;
