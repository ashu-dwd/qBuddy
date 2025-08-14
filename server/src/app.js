import express from "express";
import morgan from "morgan";
import cors from "cors";
import chatRoute from "./routes/chat.route.js";
import { limiter } from "./utils/rateLimit.js";

export const app = express();

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

//api routes
app.use("/api/v1/chat", chatRoute);
