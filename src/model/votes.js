const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
    },
    coming: {
      type: Number,
      default: 0,
      required: true,
    },
    maybe: {
      type: Number,
      default: 0,
      required: true,
    },
    notcoming: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Vote = mongoose.model("Vote", VoteSchema);
