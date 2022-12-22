import { Router } from 'express';
import OrderController from '../controllers/orderController.js';
import authJwtMiddleware from '../middleware/authJwtMiddleware.js';

const router = Router();

router.post('/order', authJwtMiddleware, OrderController.addOrder);
router.get('/getOrders', authJwtMiddleware, OrderController.getOrders);

export default router;
