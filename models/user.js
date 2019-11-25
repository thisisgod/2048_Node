import mongoose from "mongoose";
import Joi from "joi";
import { interfaceDeclaration } from "babel-types";

const User = mongoose.model('User',new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    score:{
        type: Number,
        required: false,
        default: 0
    }
}));

function validateUser(user){
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };
    return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;