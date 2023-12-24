import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user/user.routes.js"
import authRoutes from "./routes/auth/auth.route.js"
import dataRoutes from './routes/data/data.routes.js'
//connecting to the db
dotenv.config();
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("connected to database");
    })
    .catch((error) => {
        console.log("database not connected", error);
    })

// starting the app 
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log("server listening on port: 3000");
})

app.use(express.json());
app.use(cookieParser())


// middleware functions for user and auth routes

app.use('/server/auth', authRoutes);
app.use('/server/user', userRoutes);
app.use('/server/data', dataRoutes);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    console.log(error);
    res.status(statusCode).json({
        success: false,
        message: message,
    });
})