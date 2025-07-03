import { Router } from "express";
import UserRoutes from "./Routers/AuthRoute.js";
import inverntoryRoute from "./Routers/inverntoryRoute.js";
import dealershipRoute from "./Routers/dealershipRoute.js"
import OrderRouter from "./Routers/OrderRouter.js"
import activityLogRoutes from './Routers/activityRoute.js';
import agingStockRoutes from './Routers/agingStockRoutes.js';
import reportRoutes from './Routers/reportRoutes.js';

const router = Router();
router.use("/api/d1", UserRoutes);
router.use("/api/d1", inverntoryRoute);
router.use("/api/d1", dealershipRoute)
router.use("/api/d1", OrderRouter)
router.use('/api/d1', activityLogRoutes);
router.use('/api/d1', agingStockRoutes);
router.use('/api/d1', reportRoutes);

export default router;
