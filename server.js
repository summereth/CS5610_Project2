import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("frontend"));

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
