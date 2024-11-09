import express from 'express';
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus
} from '../controllers/orderController';
import adminAuth from '../middleware/adminAuth';
import userAuth from '../middleware/auth';
const orderRouter = express.Router();
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.post('/razorpay', userAuth, placeOrderRazorpay);

orderRouter.get('/userOrders', userAuth, userOrders);

export default orderRouter;
