import express from 'express';
import { getMoviesFromWatchlist, addMovieToWatchlist, removeMovieFromWatchlist } from '../controllers/watchlist.controller.js';

const watchlistRouter = express.Router();

watchlistRouter.get('/', getMoviesFromWatchlist);
watchlistRouter.post('/', addMovieToWatchlist);
watchlistRouter.put('/', removeMovieFromWatchlist);

export default watchlistRouter;
