const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

require("dotenv").config(); // Must be on first line always
const port = process.env.PORT;

const server = express()


//middleware
server.use(cors());
server.use(express.json());

server.listen(port,()=>{
    console.log("Server started and listening in port " + port)
})

server.get("/", (req,res)=> {
    res.send("Server working")
})


server.get("/test-db", async(req,res) => {
    try{
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("DB error")
    }
})
