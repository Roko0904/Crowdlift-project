 /* global require, module */
 const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    donorMobile: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "UPI", 
    },
    status: {
      type: String,
      default: "completed",  
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);