import express from 'express';
import { getMoviesFromWatchlist, addMovieToWatchlist } from '../controllers/watchlist.controller.js';

const watchlistRouter = express.Router();

watchlistRouter.get('/', getMoviesFromWatchlist);
watchlistRouter.post('/', addMovieToWatchlist);

export default watchlistRouter;
