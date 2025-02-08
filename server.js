import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import planRoutes from "./routes/planRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("frontend"));

// routes
app.use("/api/exercises", exerciseRoutes);
app.use("/api/plans", planRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
