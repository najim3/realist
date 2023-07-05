import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config.js";

const app = express();
//
mongoose
  .connect(DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// route
app.get("/api", (req, res) => {
  res.json({
    data: "hello from nodejs api",
  });
});

app.listen(8000, () => console.log("server running on port 8000"));
