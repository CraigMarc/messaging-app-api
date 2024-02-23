const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sentBy: { type: Schema.Types.ObjectId, ref: "User" },
  sentTo: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: new Date() },
  text: { type: String, required: true },
  time: { type: Number, required: true },
  read: { type: Boolean, required: true }
});



// Export model
module.exports = mongoose.model("Message", MessageSchema);