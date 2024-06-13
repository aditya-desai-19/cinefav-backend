import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './src/routes/user.routes.js';
import movieRouter from './src/routes/movie.routes.js';
import watchlistRouter from './src/routes/watchlist.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/watchlist", watchlistRouter);

export { app }