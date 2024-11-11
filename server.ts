import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb';
import userRouter from './routes/userRoute';
import productRouter from './routes/productRoute';
import cartRouter from './routes/cartRoute';
import orderRouter from './routes/orderRoute';

//App Config
const app = express();
const port = process.env.PORT || 2333;
connectDB();

//Middlewares
app.use(express.urlencoded({extended: true})).use(express.json()); 
// .use(cors());

//api
app.use('/api/user', userRouter)
    .use('/api/product', productRouter)
    .use('/api/cart', cartRouter)
    .use('/api/order', orderRouter);

app.get('/', (request, response) => {
    response.send('Express Server is running');
});
app.listen(port, () => console.log(`Server is running on 🎉http://localhost:${port}🎉`));