import express from "express";
import { ENV } from "../config/env.js";
import connectDB from "../config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "../config/inngest.js";

await connectDB();

const app = express();
const PORT = ENV.PORT;

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({client: inngest, functions}));

app.get("/", (req, res) => {
    res.send("Welcome to NexBuy")
});

app.listen(PORT, () => {
    console.log(`Server is running on port on http://localhost:${PORT}`);
});