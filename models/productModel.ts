import mongoose from 'mongoose';
interface IProduct {
    name: string;
    description: string;
    price: number;
    image: Array<string>;
    category: string;
    subCategory: string;
    sizes: Array<string>;
    date: number;
    bestseller?: boolean;
}
const productSchema = new mongoose.Schema<IProduct>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: [String], required: true},
    category: {type: String, required: true},
    subCategory: {type: String, required: true},
    sizes: {type: [String], required: true},
    date: {type: Number, required: true},
    bestseller: {type: Boolean}
});
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export default Product;
