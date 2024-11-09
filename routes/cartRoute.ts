import express from 'express';
import {addToCart, updateCart, getUserCart} from '../controllers/cartController';
import userAuth from '../middleware/auth';
const cartRouter = express.Router();
cartRouter.get('/get', userAuth, getUserCart);
cartRouter.post('/add', userAuth, addToCart);
cartRouter.post('/update', userAuth, updateCart);
export default cartRouter;
