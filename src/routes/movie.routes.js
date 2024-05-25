import express from 'express';
import { getMovieById, getMovies, registerMovie, updateMovieById, searchMovie } from '../controllers/movie.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middlewares.js';

const movieRouter = express.Router();

movieRouter.get('/', getMovies);
movieRouter.post('/', registerMovie);
movieRouter.get('/', getMovieById);
movieRouter.put('/', updateMovieById);
movieRouter.get('/search', searchMovie)

export default movieRouter;
