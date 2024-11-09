import type {controllerAction} from '.';
import Order from '../models/orderModel';
import User from '../models/userModel';
const placeOrder: controllerAction = async (request, response) => {
    try {
        const {userId, items, amount, address} = request.body;
        const orderData = {userId, items, amount, paymentMethod: 'COD', payment: false, date: Date.now(), address};
        const newOrder = new Order(orderData);
        await newOrder.save();
        await User.findByIdAndUpdate(userId, {cartData: {}});
        response.json({success: true, message: '下单成功'});
    } catch (e: any) {
        response.json({success: false, message: e.message});
    }
};
const placeOrderStripe: controllerAction = async (request, response) => {};
const placeOrderRazorpay: controllerAction = async (request, response) => {};
const allOrders: controllerAction = async (request, response) => {};
const userOrders: controllerAction = async (request, response) => {
    try {
        const {userId} = request.body;
        const orders = await Order.find({userId});
        response.json({success: true, data: orders, message: '获取用户订单成功'});
    } catch (e: any) {
        response.json({success: false, message: e.message});
    }
};
const updateStatus: controllerAction = async (request, response) => {};
export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus};
