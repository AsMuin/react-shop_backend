import type {controllerAction} from '.';
import User from '../models/userModel';
const addToCart: controllerAction = async (request, response) => {
    try {
        const {userId, itemId, size}: {userId: string; itemId: string; size: 'S' | 'M' | 'L' | 'XL'} = request.body;
        const userData = await User.findById(userId);
        const cartData = userData?.cartData ?? {};
        if (cartData && cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await User.findByIdAndUpdate(userId, {cartData});
        response.json({success: true, message: '添加购物车成功'});
    } catch (error: any) {
        console.log(error);
        response.json({success: false, message: error.message});
    }
};
const updateCart: controllerAction = async (request, response) => {
    try {
        const {
            userId,
            itemId,
            size,
            quantity
        }: {userId: string; itemId: string; size: 'S' | 'M' | 'L' | 'XL'; quantity: number} = request.body;
        const userData = await User.findById(userId);
        let cartData = userData?.cartData ?? {};
        cartData[itemId] ??= {};
        if (quantity === 0) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }
        await User.findByIdAndUpdate(userId, {cartData});
        response.json({success: true, message: '更新购物车成功'});
    } catch (error: any) {
        console.log(error);
        response.json({success: false, message: error.message});
    }
};
const getUserCart: controllerAction = async (request, response) => {
    try {
        const {userId} = request.body;
        const userData = await User.findById(userId);
        const cartData = userData?.cartData ?? {};
        response.json({success: true, data: cartData, message: '获取用户购物车数据成功'});
    } catch (error: any) {
        console.log(error);
        response.json({success: false, message: error.message});
    }
};
export {addToCart, updateCart, getUserCart};
