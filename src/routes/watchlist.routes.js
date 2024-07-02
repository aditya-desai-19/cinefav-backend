import express from 'express';
import { getMoviesFromWatchlist, addMovieToWatchlist, removeMovieFromWatchlist } from '../controllers/watchlist.controller.js';
import { restrictUser } from '../middlewares/verifyToken.middlewares.js';

const watchlistRouter = express.Router();

watchlistRouter.get('/', restrictUser("NORMAL"), getMoviesFromWatchlist);
watchlistRouter.post('/', restrictUser("NORMAL"), addMovieToWatchlist);
watchlistRouter.put('/', restrictUser("NORMAL"), removeMovieFromWatchlist);

export default watchlistRouter;
