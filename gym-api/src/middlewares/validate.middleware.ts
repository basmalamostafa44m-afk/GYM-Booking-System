import { Request, Response, NextFunction } from "express";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "fullName, email, password and role are required" });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!STRONG_PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters and include at least one letter and one number"
    });
  }
  if (role !== "Member" && role !== "Trainer") {
    return res.status(400).json({ message: "role must be either 'Member' or 'Trainer'" });
  }
  next();
}
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  next();
}
export function validateClassSession(req: Request, res: Response, next: NextFunction) {
  const { title, timeSlot, capacity } = req.body;

  if (!title || !timeSlot || capacity === undefined) {
    return res.status(400).json({ message: "title, timeSlot and capacity are required" });
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    return res.status(400).json({ message: "capacity must be a positive integer" });
  }

  const parsedDate = new Date(timeSlot);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "timeSlot must be a valid date" });
  }

  if (parsedDate.getTime() <= Date.now()) {
    return res.status(400).json({ message: "Sessions can only be created for future time slots" });
  }

  next();
}
