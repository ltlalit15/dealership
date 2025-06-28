import express from "express";
import multer from 'multer';

import { addInventory,  getInventory, getInventoryById, DeleteInventory, updateInventory, uploadInventory} from "../Controllers/inverntoryCtrl.js"

const router = express.Router();
router.post('/inventory', addInventory);
router.get('/inventory', getInventory);
router.get('/inventory/:id',getInventoryById );
router.delete('/inventory/:id',DeleteInventory);
router.put('/inventory/:id', updateInventory);

const upload = multer({ dest: 'uploads/' });
router.post('/upload', upload.single('file'), uploadInventory);


export default router;
