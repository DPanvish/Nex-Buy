import express from "express";
import path from "path";
import { ENV } from "../config/env.js";
import connectDB from "../config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "../config/inngest.js";
import adminRoutes from "../routes/admin.route.js";

await connectDB();

const app = express();
const PORT = ENV.PORT;

const __dirname = path.resolve();

app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/inngest", serve({client: inngest, functions}));
app.use("/api/admin", adminRoutes);


// Making our app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port on http://localhost:${PORT}`);
});