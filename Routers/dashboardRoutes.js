import express from "express";
import { getDashboardSummary, getfinaceDashboard, getsalespersonDashboard } from "../Controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard/summary", getDashboardSummary);
router.get("/dashboard/getfinaceDashboard", getfinaceDashboard);
router.get("/dashboard/getsalespersonDashboard/:country", getsalespersonDashboard);







export default router;
