const pool = require("../config/db");

const createService = async (req, res) => {
    try{
        const {name, duration} = req.body;
        if(!name || !duration){
            return res.status(400).json({message:"Invalid credentials"})
        }
        
        const {user} = req;
        const {userId} = user;
        const newService = await pool.query("INSERT INTO services (name, duration, user_id) VALUES ($1, $2, $3 ) RETURNING *", [name, duration, userId])
        
        
        
        return res.status(201).json(newService.rows[0])
    } catch(err){
        if (err.code == "23505"){
            return res.status(409).json({message:"Service and Duration already exists!"})
        }
        return res.status(500).json({message:"Server error"})
    }
}

const getServices = async (req, res) => {
    // 1. Get userId fron token params 
    try{
        const userId = req.user.userId;

        // 2. Make query and save response
        
        const services = await pool.query("SELECT * FROM services WHERE user_id = $1", [userId])
        
        //3. Return status and query result
        return res.status(200).json({services:services.rows})
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
}

module.exports = {createService, getServices}