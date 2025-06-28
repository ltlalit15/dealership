import { Router } from "express";
import UserRoutes from "./Routers/AuthRoute.js";
import inverntoryRoute from "./Routers/inverntoryRoute.js";
import dealershipRoute from "./Routers/dealershipRoute.js"

const router = Router();

router.use("/api/d1", UserRoutes);
router.use("/api/d1", inverntoryRoute);
router.use("/api/d1", dealershipRoute)

export default router;
