import express from 'express';
import { getMovieById, getMovies, registerMovie, updateMovieById } from '../controllers/movie.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middlewares.js';

const movieRouter = express.Router();

movieRouter.get('/', verifyToken, getMovies);
movieRouter.post('/', verifyToken, registerMovie);
movieRouter.get('/:id', verifyToken, getMovieById);
movieRouter.put('/:id', verifyToken, updateMovieById);

export default movieRouter;
