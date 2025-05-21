import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;
app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
});