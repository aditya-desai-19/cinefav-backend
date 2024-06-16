import express from 'express';
import { getMovieById, getMovies, registerMovie, updateMovieById } from '../controllers/movie.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middlewares.js';

const movieRouter = express.Router();

movieRouter.get('/', getMovies);
movieRouter.post('/', registerMovie);
movieRouter.get('/', getMovieById);
movieRouter.put('/', updateMovieById);

export default movieRouter;
