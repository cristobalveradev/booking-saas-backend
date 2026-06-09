const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try{
        const {email, password, name} = req.body;

        // 1. basic Validation
        if(!email || !password || !name){
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
            "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name",
            [email, hashedPassword, name]
        )

        // 5. response
        res.status(201).json({
            user:newUser.rows[0], 
            message: "User created"
        });
    }catch(err){
        console.error(err);
        res.status(500).json({"message": "Server error"})
    }
}

const login = async (req,res) => {
    try{
        const {email, password} = req.body;
        
        // 1. check if user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        
        if (user.rows.length === 0){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        // 2. compare passwords
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password_hash
        );

        if(!validPassword){
            res.status(400).json({message:"Invalid Credentials"})
        }

        // 3. Generate token
        
        const token = jwt.sign(
            {
                userId:user.rows[0].id},
                process.env.JWT_SECRET,
                {expiresIn:"1d"}
        );

        res.json({
            token,
            user:{
                id: user.rows[0].id,
                name: user.rows[0].name
            }
        })
        
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
}
module.exports = {register, login};