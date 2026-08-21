import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/validate.middleware";

const router = Router();

/**
* @swagger
* components:
*   schemas:
*     RegisterUser:
*       type: object
*       required:
*         - fullName
*         - email
*         - password
*         - role
*       properties:
*         fullName:
*           type: string
*           description: User full name
*         email:
*           type: string
*           description: User email
*         password:
*           type: string
*           description: User password (min 8 characters, at least one letter and one number)
*         role:
*           type: string
*           enum: [Member, Trainer]
*           description: User role
*       example:
*         fullName: Ahmed Ali
*         email: ahmed@example.com
*         password: pass1234
*         role: Member
*     LoginUser:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*         password:
*           type: string
*       example:
*         email: ahmed@example.com
*         password: pass1234
 */ /**
* @swagger
* /api/auth/register:
*   post:
*     tags:
*       - Auth
*     summary: Register a new user (Member or Trainer)
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/RegisterUser'
*     responses:
*       201:
*         description: User registered successfully
*       400:
*         description: Invalid registration data
*       500:
*         description: Some server error
 */ router.post("/register", validateRegister, register); /**
* @swagger
* /api/auth/login:
*   post:
*     tags:
*       - Auth
*     summary: Login and receive a JWT token
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/LoginUser'
*     responses:
*       200:
*         description: Login successful, JWT token returned
*       401:
*         description: Invalid credentials
*       500:
*         description: Some server error
 */ router.post("/login", validateLogin, login); export default router;
