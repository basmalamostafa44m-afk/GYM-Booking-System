import { Router } from "express";
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionBookings
} from "../controllers/class.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";
import { validateClassSession } from "../middlewares/validate.middleware";

const router = Router();

/**
* @swagger
* components:
*   schemas:
*     ClassSession:
*       type: object
*       required:
*         - title
*         - timeSlot
*         - capacity
*       properties:
*         title:
*           type: string
*           description: Class title
*         timeSlot:
*           type: string
*           format: date-time
*           description: Date/time of the class (must be in the future)
*         capacity:
*           type: integer
*           description: Maximum number of members that can book this session
*       example:
*         title: Morning Yoga
*         timeSlot: 2026-09-01T08:00:00.000Z
*         capacity: 15
 */ /**
* @swagger
* /api/sessions:
*   post:
*     tags:
*       - Class Sessions
*     summary: Create a new class session (Trainer only)
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/ClassSession'
*     responses:
*       201:
*         description: Class session created successfully
*       400:
*         description: Invalid class session data
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, Trainer role required
*       500:
*         description: Some server error
 */ router.post("/", authMiddleware, requireRole("Trainer"), validateClassSession, createSession); /**
* @swagger
* /api/sessions:
*   get:
*     tags:
*       - Class Sessions
*     summary: Browse and search class sessions
*     parameters:
*       - in: query
*         name: title
*         schema:
*           type: string
*         required: false
*         description: Filter by class title
*       - in: query
*         name: trainerName
*         schema:
*           type: string
*         required: false
*         description: Filter by trainer name
*       - in: query
*         name: day
*         schema:
*           type: string
*           format: date
*         required: false
*         description: Filter by day (YYYY-MM-DD)
*       - in: query
*         name: availability
*         schema:
*           type: string
*           enum: [available]
*         required: false
*         description: Filter sessions that still have spots remaining
*     responses:
*       200:
*         description: List of class sessions
*       500:
*         description: Some server error
 */ router.get("/", getAllSessions); /**
* @swagger
* /api/sessions/{id}:
*   get:
*     tags:
*       - Class Sessions
*     summary: Get a class session by id
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Class session id
*     responses:
*       200:
*         description: Class session retrieved successfully
*       404:
*         description: Class session not found
*       500:
*         description: Some server error
 */ router.get("/:id", getSessionById); /**
* @swagger
* /api/sessions/{id}:
*   put:
*     tags:
*       - Class Sessions
*     summary: Update a class session (Trainer only, own session)
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Class session id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/ClassSession'
*     responses:
*       200:
*         description: Class session updated successfully
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, not the owning trainer
*       404:
*         description: Class session not found
*       500:
*         description: Some server error
 */ router.put("/:id", authMiddleware, requireRole("Trainer"), updateSession); /**
* @swagger
* /api/sessions/{id}:
*   delete:
*     tags:
*       - Class Sessions
*     summary: Delete a class session (Trainer only, own session, no confirmed bookings)
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Class session id
*     responses:
*       200:
*         description: Class session deleted successfully
*       400:
*         description: Session has confirmed bookings and cannot be deleted
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, not the owning trainer
*       404:
*         description: Class session not found
*       500:
*         description: Some server error
 */ router.delete("/:id", authMiddleware, requireRole("Trainer"), deleteSession); /**
* @swagger
* /api/sessions/{id}/bookings:
*   get:
*     tags:
*       - Class Sessions
*     summary: View bookings for a session owned by the requesting trainer
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: Class session id
*     responses:
*       200:
*         description: Bookings retrieved successfully
*       401:
*         description: No token provided / invalid token
*       403:
*         description: Forbidden, not the owning trainer
*       404:
*         description: Class session not found
*       500:
*         description: Some server error
 */ router.get("/:id/bookings", authMiddleware, requireRole("Trainer"), getSessionBookings); export default router;
