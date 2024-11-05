import express from 'express';
import cors from 'cors';
import 'dotenv/config';
//App Config
const app = express();
const port = process.env.PORT || 2333;
//Middlewares
app.use(express.json());
app.use(cors());
//api
app.get('/', (request, response) => {
    response.send('Express Server is running');
});
//# sourceMappingURL=server.js.map