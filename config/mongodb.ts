import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB🙌');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/react-shop`);
};
export default connectDB;
