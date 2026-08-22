import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import { ClassSession } from "../models/class.model";
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
      };
}
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const session = await ClassSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Class session not found" });
    }
    if (session.timeSlot.getTime() <= Date.now()) {
      return res.status(400).json({ message: "Sessions can only be booked for future time slots" });
    }
    const existingBooking = await Booking.findOne({
      session: sessionId,
      member: req.user?.id,
      status: "booked"
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this session" });
    }

    const bookedCount = await Booking.countDocuments({
      session: sessionId,
      status: "booked"
    });

    if (bookedCount >= session.capacity) {
      return res.status(400).json({ message: "This session is fully booked" });
    }

    const booking = await Booking.create({
      session: sessionId,
      member: req.user?.id,
      status: "booked"
    });

    return res.status(201).json({
      message: "Session booked successfully",
      booking
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ member: req.user?.id });
    const bookingsWithSession = await Promise.all(
      bookings.map(async (booking) => {
        const session = await ClassSession.findById(booking.session);
        return {
          ...booking.toObject(),
          session
        };
      })
    );

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings: bookingsWithSession
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.member !== req.user?.id) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};