import express from "express";
import * as auth from "../contriller/auth.js";

const router = express.Router();

router.get("/", auth.welcome);

export default router;
