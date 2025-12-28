import express from "express";
import { ENV } from "../config/env.js";
import connectDB from "../config/db.js";
import { clerkMiddleware } from '@clerk/express'

await connectDB();

const app = express();
const PORT = ENV.PORT;

app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.send("Welcome to NexBuy")
});

app.listen(PORT, () => {
    console.log(`Server is running on port on http://localhost:${PORT}`);
});