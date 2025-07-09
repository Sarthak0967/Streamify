import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'; // Automatically loads environment variables from .env file
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

// dotenv.config();

const app = express();
const PORT = process.env.PORT; // Default to 5001 if PORT is not set

const __dirname = path.resolve(); // Get the current directory

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json()); 
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, '../frontend','dist', 'index.html'));
    });
}
     

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
 })