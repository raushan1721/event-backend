const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    image: {
        type: String,
        required:false
    },
    address: {
        type: String,
        required:false
    }
},{timestamps:true});

module.exports=Profile=mongoose.model("Profile",profileSchema)