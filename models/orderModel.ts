import mongoose from 'mongoose';
interface IAddress {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    province: string;
    zipCode: string;
    phone: string;
}
interface IOrder {
    userId: string;
    items: {name: string; quantity: number; price: number}[];
    amount: number;
    address: IAddress;
    status: string;
    paymentMethod: string;
    payment: boolean;
    date: number;
}
const orderSchema = new mongoose.Schema<IOrder>({
    userId: {type: String, required: true},
    items: {type: [Object], required: true},
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, required: true, default: 'Order Placed'},
    paymentMethod: {type: String, required: true},
    payment: {type: Boolean, required: true, default: false},
    date: {type: Number, required: true}
});
const Order = mongoose.model<IOrder>('order', orderSchema);
export default Order;
