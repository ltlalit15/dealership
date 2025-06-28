import express from "express";
import { addDealership, getDealership, getDealershipByid, DeleteDealership, updateDealership} from "../Controllers/dealershipCtrl.js";
const router = express.Router();
router.post ('/dealership', addDealership);
router.get('/dealership', getDealership);       
router.get('/dealership/:id', getDealershipByid)
router.delete('/dealership/:id', DeleteDealership)
router.put('/dealership/:id', updateDealership)

export default router;