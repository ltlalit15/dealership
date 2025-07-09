
import express from "express";
import { generateReport} from "../Controllers/reportCtrl.js"

const router = express.Router();
router.post("/generate",generateReport);

export default router;




