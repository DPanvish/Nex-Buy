import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Welcome to NexBuy")
});

app.listen(PORT, () => {
    console.log(`Server is running on port on http://localhost:${PORT}`);
});