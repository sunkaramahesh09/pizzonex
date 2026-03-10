const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String, default: "" },
        customizations: [String],
      },
    ],
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"],
      default: "Order Received",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
