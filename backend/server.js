import express from "express";
import Auth from "./routes/Auth_route.js";
import movieRoute from "./routes/movieRoute.js";
import searchRoute from './routes/Search_route.js';
import AiRoute from './routes/AI_route.js';
import tvshow from "./routes/Tvshow_route.js";
import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/Db.js";
import cookieParser from "cookie-parser";
import protectroute from "./middleware/protectRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '../frontend/dist');

const app = express();
const port = ENV_VARS.PORT;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", Auth);
app.use("/api/v1/movies", protectroute, movieRoute);
app.use("/api/v1/tvshow", protectroute, tvshow);
app.use("/api/v1/search", protectroute, searchRoute);
app.use("/api/v1/ai_summerizer", protectroute, AiRoute);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Serve frontend in production
if (ENV_VARS.NODEENV === "production") {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Start server **only if not running in test mode**
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log("Server is working on port", port);
    connectDB();
  });
}

// Export app for testing
export default app;
