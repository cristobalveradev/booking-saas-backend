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
        
        
        
        return res.status(201).json({service:newService.rows[0]})
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
        const userId = req.params.id;
        // 2. Make query and save response
        
        const services = await pool.query("SELECT * FROM services WHERE user_id = $1", [userId])
        
        //3. Return status and query result
        return res.status(200).json({services:services.rows})
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
}


const deleteService = async (req, res) => {
    try{
    const {serviceId} = req.body
        const deletedService = await pool.query("DELETE FROM services WHERE id = $1", [serviceId])
        if(deletedService.rowCount === 0){
            return res.status(404).json({message:"Service not found or unauthorized"})
        }
        return res.status(200).json({message:"Service deleted"})
    } catch(err){
        return res.status(500).json({message:"Internal server error"})
    }   
}


module.exports = {createService, getServices, deleteService}