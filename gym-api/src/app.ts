import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { swaggerSpec } from "./config/swagger";
import { logger } from "./middlewares/logger.middleware";
import authRoutes from "./routes/auth.route";
import sessionRoutes from "./routes/class.route";
import bookingRoutes from "./routes/booking.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;