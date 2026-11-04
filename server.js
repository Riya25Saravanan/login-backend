const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((error) => {
    console.log("MongoDB Connection Error:", error);
});
// home page 
app.get("/", (req,res)=>{
    res.send("login form server is running");
})


// GET API - Fetch all users
app.get("/register", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "User not fetch",
            error: error.message
        });
    } 

});

        // POST API
   app.post("/register",

       [    
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please enter a valid email address, E-mail is required! "),
        
        
        body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .custom((value) => {
        if (!value.trim()) {
            throw new Error("Password cannot contain only spaces");
        }
        return true;
    })


       ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()[0].msg,
                    field: errors.array()[0].path
                });
            }
            const { name, email, password } = req.body;

            // Create new user
            const newUser = new User({
                name,
                email,
                password
            });

            // Save in MongoDB
            const savedUser = await newUser.save();

            res.status(201).json({
                message: "User registered successfully",
                data: {
                    name: savedUser.name,
                    email: savedUser.email
                }
            });

        }
        catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Email already exists",
                    field: "email"
                });
            }
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });

        }

    }
);
// Server
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});