import type {controllerAction} from '.';
import {uploader} from '../config/qiniu';
import Product from '../models/productModel';
const addProduct: controllerAction = async (request, response) => {
    try {
        const {name, price, category, subCategory, sizes, bestseller, description} = request.body;
        const files = request.files as {
            [fieldName: string]: Express.Multer.File[];
        };
        const uploadImages = await Promise.all(
            Object.values(files)
                .flat()
                .map(file => {
                    console.log(file.path, file.filename);
                    return uploader(file.path, file.filename);
                })
        );
        const product = {
            name,
            price: Number(price),
            category,
            description,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true',
            image: uploadImages,
            date: Date.now()
        };
        console.log(product);
        await new Product(product).save();
        response.json({success: true, message: '商品添加成功'});
    } catch (error: any) {
        response.json({success: false, message: error.message});
    }
};
const getProductList: controllerAction = async (request, response) => {
    try {
        const productList = await Product.find();
        response.json({success: true, data: productList, message: '商品列表获取成功'});
    } catch (error: any) {
        response.json({success: false, message: error.message});
    }
};
const removeProduct: controllerAction = async (request, response) => {
    try {
        await Product.findByIdAndDelete(request.body.id);
        response.json({success: true, message: '商品删除成功'});
    } catch (error: any) {
        response.json({success: false, message: error.message});
    }
};
const singleProduct: controllerAction = async (request, response) => {
    try {
        const {productId} = request.body;
        const product = await Product.findById(productId);
        response.json({success: true, data: product, message: '商品获取成功'});
    } catch (error: any) {
        response.json({success: false, message: error.message});
    }
};

export {addProduct, getProductList, removeProduct, singleProduct};
