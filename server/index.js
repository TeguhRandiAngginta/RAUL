import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import movieRouter from "./routes/movie.route.js";
import reviewRouter from "./routes/review.route.js"; //penambahan agar bisa ngirim review
import { errorHandler } from "./configs/middleware.js";

const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// api
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/reviews", reviewRouter); //penambahan agar bisa ngirim review

// default route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

// 404 handler (harus terakhir SEBELUM errorHandler)
app.use((req, res) => {
    res.status(404).json({ message: "not found" });
});

// error handler khusus
app.use(errorHandler);

// start server
app.listen(PORT, () => {
    console.log(`Server started, listening on port ${PORT}`);
});
