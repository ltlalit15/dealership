import express from "express";
import { addOrder, updateOrderStatus, getOrderById, deleteOrder, updateOrder, getAllOrder} from "../Controllers/orderCtrl.js"


const router = express.Router();
router.post('/order', addOrder);
router.patch('/order/status/:dealership_id', updateOrderStatus);
router.get('/order/:id', getOrderById);
router.delete('/order/:id', deleteOrder);
router.put('/order/:id', updateOrder);
router.get('/order', getAllOrder);



export default router;
