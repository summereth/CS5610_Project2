import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("frontend"));

// routes
app.use("/api/exercises", exerciseRoutes);
app.use("/api/plans", planRoutes);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}

export default app;
