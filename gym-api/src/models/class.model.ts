import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim:true
  },
  trainer: {
    type: String,
    required: true
  },
  timeSlot: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  }
});

export const ClassSession = mongoose.model("ClassSession", classSessionSchema);