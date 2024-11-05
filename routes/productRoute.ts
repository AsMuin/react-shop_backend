import express from 'express';
import {addProduct, getProductList, singleProduct, removeProduct} from '../controllers/productController';
import upload from '../middleware/multer';
import adminAuth from '../middleware/adminAuth';

const productRouter = express.Router();

productRouter.get('/list', getProductList);
productRouter.post(
    '/add',
    adminAuth,
    upload.fields([
        {name: 'image1', maxCount: 1},
        {name: 'image2', maxCount: 1},
        {name: 'image3', maxCount: 1},
        {name: 'image4', maxCount: 1}
    ]),
    addProduct
);
productRouter.post('/single', singleProduct);
productRouter.post('/remove', adminAuth, removeProduct);

export default productRouter;
