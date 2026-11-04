const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            "Please enter valid email"
        ]
    },

    password: {
        type: String,
        required: true,
        minlength : [8, "please enter atleast 8 "]
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;