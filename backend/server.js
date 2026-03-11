const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const homeRoute = require("./routes/homeRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth",authRoutes);

app.use("/api",homeRoute);

app.listen(5000,()=>{

  console.log("Server running on port 5000");

});