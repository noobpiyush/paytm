const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI);

//creating userschema

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        minLength:6,
        maxLength:30,
        trim:true
    },

    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:100,
        trim:true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    } 
});

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true   
    },
    balance:{
        type:Number,
        required:true
    }
});

//creating model

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model("Account",accountSchema);

module.exports = {
    User,
   Account
}
