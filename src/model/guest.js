const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const guestSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    members: {
      type: Number,
      required: true,
      default:1
    },
    
  },
  { timestamps: true }
);

module.exports = Guest = mongoose.model("Guest", guestSchema);
