import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './src/routes/user.routes.js';
import movieRouter from './src/routes/movie.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);

export { app }