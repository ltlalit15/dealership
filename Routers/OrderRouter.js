import express from "express";
import { addOrder, updateOrderStatus, getOrderById, deleteOrder, updateOrder} from "../Controllers/orderCtrl.js"


const router = express.Router();
router.post('/order', addOrder);
router.patch('/order/status/:dealership_id', updateOrderStatus);
router.get('/order/:id', getOrderById);
router.delete('/order/:id', deleteOrder);
router.put('/order/:id', updateOrder);

export default router;