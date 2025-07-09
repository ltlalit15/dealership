import express from "express";
import { addOrder, updateOrderStatusdelershipID, getOrderById, deleteOrder, updateOrder, getAllOrder, getOrderByCountry,updateOrderStatusByID, RecentOrder} from "../Controllers/orderCtrl.js"


const router = express.Router();
router.post('/order', addOrder);
router.patch('/order/statusdealership/:dealership_id', updateOrderStatusdelershipID);
router.patch('/order/statusbyfinance/:id', updateOrderStatusByID);
router.get('/recentOrder', RecentOrder);

router.get('/order/:id', getOrderById);
router.delete('/order/:id', deleteOrder);
router.put('/order/:id', updateOrder);
router.get('/order', getAllOrder);
router.get('/getOrderByCountry/:country', getOrderByCountry);


export default router;
