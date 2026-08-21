import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  session: {
    type: String,
    required: true
  },
  member: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum:["booked","cancelled"],
    default: "booked"
  }
});

export const Booking = mongoose.model("Booking", bookingSchema);