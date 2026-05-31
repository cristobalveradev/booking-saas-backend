const pool = require("../config/db");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try{
        const {email, password} = req.body;

        // 1. basic Validation
        if(!email || !password){
            return res.status(400).json({message:"Missing FIelds"});
        }

        // 2. check if user exists
        const userExists = await pool.query(
            "SELECT * FROM users WHERE EMAIL = $1",
            [email]
        );

        if(userExists.rows.length > 0 ){
            return res.status(400).json({message:"User already exists"})
        }

        // 3. hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // 4. insert user
        const newUser = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, hashedPassword]
        )

        // 5. response
        res.status(201).json(newUser.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({"message": "Server error"})
    }
}

module.exports = {register};