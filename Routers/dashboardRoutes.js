import express from "express";
import { getDashboardSummary } from "../Controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard/summary", getDashboardSummary);

export default router;
