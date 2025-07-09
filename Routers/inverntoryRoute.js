import express from "express";
import multer from 'multer';
import { pool } from "../Config/dbConnect.js";
import { google } from 'googleapis';
import { addInventory,  getInventory, getInventoryById, DeleteInventory, updateInventory, uploadInventory, syncInventory, getInventoryBybycountry, getInventoryBypagination} from "../Controllers/inverntoryCtrl.js"
const router = express.Router();
router.post('/inventory', addInventory);
router.get('/inventory', getInventory);
router.get('/inventory/:id',getInventoryById );
router.delete('/inventory/:id',DeleteInventory);
router.put('/inventory/:id', updateInventory);
router.get('/inventory-by-country/:COUNTRY', getInventoryBybycountry);
router.get('/api/inventory/', getInventoryBypagination);


// GET /api/inventory?page=2&limit=10

const upload = multer({ dest: 'uploads/' });
router.post('/upload', upload.single('file'), uploadInventory);
// ✅ Google Sheet Sync Route (uses controller logic)
router.get('/sync-google-sheet', async (req, res) => {
  try {
    await syncInventory(); // controller handles Google API logic
    res.status(200).json({ message: 'Inventory synced successfully' });
  } catch (err) {
    console.error('❌ Google Sheet Sync Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/view-synced-data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory ORDER BY id DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get('/inventory-by-country/:COUNTRY', async (req, res) => {
//   const { COUNTRY } = req.params;
//   try {
//     const [rows] = await pool.query('SELECT * FROM inventory WHERE COUNTRY = ?', [COUNTRY]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
