const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  instituteUsername: { type: String, required: true },
  ngoUsername: { type: String, required: true },
  mealType: { type: String, required: true },
  foodItem: { type: String },
  status: { type: String, default: "pending" },
});

// ✅ Check if the model already exists before defining it again
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

module.exports = Booking;
