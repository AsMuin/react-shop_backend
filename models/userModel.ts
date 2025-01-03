import mongoose from 'mongoose';

export interface CartData {
    [key: string]: {
        [key in 'S' | 'M' | 'L' | 'XL' | 'XXL']?: number;
    };
}
export interface IUser {
    name: string;
    avatar: string | undefined;
    email: string;
    password: string;
    cartData: CartData;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        avatar: {type: String, default: undefined},
        password: {type: String, required: true},
        cartData: {type: {String: Number}, default: {}}
    },
    {minimize: false}
);
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
