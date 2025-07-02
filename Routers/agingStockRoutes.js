import express from 'express';
import { createAgingStock, updateAgingStock, deleteAgingStock, getAgingStockList, getAgingStockChartData ,exportAgingStockToExcel } from '../Controllers/agingStockCtrl.js';

const router = express.Router();

router.post('/aging-stock', createAgingStock);
router.put('/aging-stock/:id', updateAgingStock);
router.delete('/aging-stock/:id', deleteAgingStock);
router.get('/aging-stock', getAgingStockList);
router.get('/aging-stock/chart', getAgingStockChartData);
router.get('/aging-stock/export', exportAgingStockToExcel);

export default router;









