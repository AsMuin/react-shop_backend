import mongoose from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    cartData: {[key: string]: any};
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        cartData: {type: Object, default: {}}
    },
    {minimize: false}
);
const User = mongoose.model<IUser>('User', userSchema);
export default User;
