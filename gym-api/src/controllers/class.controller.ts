import { Request, Response } from "express";
import { ClassSession } from "../models/class.model";
import { Booking } from "../models/booking.model";
import { User } from "../models/user.model";
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
      };
}
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { title, timeSlot, capacity } = req.body;

    const session = await ClassSession.create({
      title,
      trainer: req.user?.id,
      timeSlot,
      capacity
    });

    return res.status(201).json({
      message: "Class session created successfully",
      session
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const { title, trainerName, day, availability } = req.query;

    const filter: any = {};

    if (title) {
      filter.title = { $regex: title as string, $options: "i" };
    }

    if (trainerName) {
      const trainers = await User.find({
        fullName: { $regex: trainerName as string, $options: "i" },
        role: "Trainer"
      });
      filter.trainer = { $in: trainers.map((t) => t._id.toString()) };
    }

    if (day) {
      const start = new Date(day as string);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.timeSlot = { $gte: start, $lt: end };
    }

    let sessions = await ClassSession.find(filter);
    let sessionsWithTrainer = await Promise.all(
      sessions.map(async (session) => {
        const trainer = await User.findById(session.trainer);
        return {
          ...session.toObject(),
          trainer: trainer
            ? { id: trainer._id, fullName: trainer.fullName, email: trainer.email }
            : null
        };
      })
    );

    if (availability === "available") {
      const withAvailability = await Promise.all(
        sessionsWithTrainer.map(async (session) => {
          const bookedCount = await Booking.countDocuments({
            session: session._id.toString(),
            status: "booked"
          });
          return { session, spotsRemaining: session.capacity - bookedCount };
        })
      );
      sessionsWithTrainer = withAvailability
        .filter((s) => s.spotsRemaining > 0)
        .map((s) => s.session);
    }

    return res.status(200).json({
      message: "Class sessions retrieved successfully",
      sessions: sessionsWithTrainer
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Class session not found" });
    }
    const trainer = await User.findById(session.trainer);

    const bookedCount = await Booking.countDocuments({
      session: session._id.toString(),
      status: "booked"
    });

    return res.status(200).json({
      message: "Class session retrieved successfully",
      session: {
        ...session.toObject(),
        trainer: trainer
          ? { id: trainer._id, fullName: trainer.fullName, email: trainer.email }
          : null
      },
      spotsRemaining: session.capacity - bookedCount
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Class session not found" });
    }

    if (session.trainer !== req.user?.id) {
      return res.status(403).json({ message: "You can only manage your own class sessions" });
    }

    const { title, timeSlot, capacity } = req.body;

    if (title !== undefined) session.title = title;
    if (timeSlot !== undefined) session.timeSlot = timeSlot;
    if (capacity !== undefined) session.capacity = capacity;

    await session.save();

    return res.status(200).json({
      message: "Class session updated successfully",
      session
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Class session not found" });
    }

    if (session.trainer !== req.user?.id) {
      return res.status(403).json({ message: "You can only manage your own class sessions" });
    }

    const confirmedBookings = await Booking.countDocuments({
      session: session._id.toString(),
      status: "booked"
    });

    if (confirmedBookings > 0) {
      return res.status(400).json({
        message: "Cannot delete a session that has confirmed bookings"
      });
    }

    await session.deleteOne();

    return res.status(200).json({ message: "Class session deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getSessionBookings = async (req: AuthRequest, res: Response) => {
  try {
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Class session not found" });
    }

    if (session.trainer !== req.user?.id) {
      return res.status(403).json({ message: "You can only view bookings for your own class sessions" });
    }

    const bookings = await Booking.find({ session: session._id.toString() });
    const bookingsWithMember = await Promise.all(
      bookings.map(async (booking) => {
        const member = await User.findById(booking.member);
        return {
          ...booking.toObject(),
          member: member
            ? { id: member._id, fullName: member.fullName, email: member.email }
            : null
        };
      })
    );

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings: bookingsWithMember
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};