import type {controllerAction} from '.';
import Order from '../models/orderModel';
import User from '../models/userModel';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
const placeOrderStripe: controllerAction = async (request, response) => {
    try {
        const {userId, items, amount, address} = request.body;
        const {origin} = request.headers;
        const orderData = {userId, items, amount, paymentMethod: 'Stripe', payment: false, date: Date.now(), address};
        const newOrder = new Order(orderData);
        await newOrder.save();
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'cny',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));
        line_items.push({
            price_data: {
                currency: 'cny',
                product_data: {
                    name: 'Deliver_fee'
                },
                unit_amount: 100
            },
            quantity: 1
        });
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment'
        });
        return response.json({success: true, data: session.url, message: '进入支付页面'});
    } catch (e: any) {
        console.error(e);
        return response.json({success: false, message: e.message});
    }
};
const allOrders: controllerAction = async (request, response) => {
    try {
        const orderList = await Order.find();
        response.json({success: true, data: orderList, message: '获取所有订单成功'});
    } catch (e: any) {
        response.json({success: false, message: e.message});
    }
};
const userOrders: controllerAction = async (request, response) => {
    try {
        const {userId} = request.body;
        const orders = await Order.find({userId});
        response.json({success: true, data: orders, message: '获取用户订单成功'});
    } catch (e: any) {
        response.json({success: false, message: e.message});
    }
};
const updateStatus: controllerAction = async (request, response) => {
    try {
        const {orderId, status} = request.body;
        await Order.findByIdAndUpdate(orderId, {status});
        const newOrder = await Order.findById(orderId);
        response.json({success: true, data: newOrder, message: '更新订单状态成功'});
    } catch (e: any) {
        response.json({success: false, message: e.message});
    }
};
const verifyStripe: controllerAction = async (request, response) => {
    try {
        const {orderId, success, userId} = request.body;
        if (success == true) {
            await Order.findByIdAndUpdate(orderId, {payment: true});
            await User.findByIdAndUpdate(userId, {cartData: {}});
            response.json({success: true, message: '支付成功'});
        } else {
            await Order.findByIdAndDelete(orderId);
            response.json({success: false, message: '支付失败, 订单已取消'});
        }
    } catch (e: any) {
        response.json({success: false, message: e.message});
    }
};
export {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe};
