const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = mongoose.Schema({
    task: {
        type: String,
        trim: true,
        minlength: 3,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    }
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password : {
        type:String,
        trim:true,
        required:true
    },
    tasks: {
        type: [{
            task: {
                type: String,
                trim: true,
                minlength: 3,
                required: true,
            },
            status: {
                type: String,
                required: true,
                default: "Pending"
            }
        }],
        default: []
    }
});


const UserModel = new mongoose.model("data", userSchema);

module.exports = UserModel;