const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT;
const server = express();

//middleware
server.use(cors({ origin: "http://localhost:5173" }));
server.use(express.json());


const authRoutes = require("./routes/auth.routes");

server.use("/auth", authRoutes)

server.listen(port,()=>{
    console.log("Server started and listening in port " + port)
})



