import express from 'express';
import {
    placeOrder,
    placeOrderStripe,
    allOrders,
    userOrders,
    updateStatus,
    verifyStripe
} from '../controllers/orderController';
import adminAuth from '../middleware/adminAuth';
import userAuth from '../middleware/auth';
const orderRouter = express.Router();
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.get('/userOrders', userAuth, userOrders);

orderRouter.post('/verifyStripe', userAuth, verifyStripe);
export default orderRouter;
