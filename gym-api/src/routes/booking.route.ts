import { Router } from "express";
import { createBooking, getMyBookings, cancelBooking } from "../controllers/booking.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const router = Router();

/**
* @swagger
* components:
*   schemas:
*     Booking:
*       type: object
*       required:
*         - sessionId
*       properties:
*         sessionId:
*           type: string
*           description: Id of the class session to book
*       example:
*         sessionId: 66f1a2b3c4d5e6f7a8b9c0d1
 */ /**
* @swagger
* /api/bookings:
*   post:
*     tags:
*       - Bookings
*     summary: Book a spot in a class session (Member only)
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Booking'
*     responses:
*       201:
*         description: Session booked successfully
*       400:
*         description: Session full, already booked, or in the past
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, Member role required
*       404:
*         description: Class session not found
*       500:
*         description: Some server error
 */ router.post("/", authMiddleware, requireRole("Member"), createBooking); /**
* @swagger
* /api/bookings/my:
*   get:
*     tags:
*       - Bookings
*     summary: List the requesting member's own bookings
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Bookings retrieved successfully
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, Member role required
*       500:
*         description: Some server error
 */ router.get("/my", authMiddleware, requireRole("Member"), getMyBookings); /**
* @swagger
* /api/bookings/{id}:
*   delete:
*     tags:
*       - Bookings
*     summary: Cancel own booking (Member only)
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Booking id
*     responses:
*       200:
*         description: Booking cancelled successfully
*       400:
*         description: Booking already cancelled
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, not the owning member
*       404:
*         description: Booking not found
*       500:
*         description: Some server error
 */ router.delete("/:id", authMiddleware, requireRole("Member"), cancelBooking); export default router;
