import express from 'express';
import { deleteMovieById, getMovieById, getMovies, registerMovie, updateMovieById } from '../controllers/movie.controller.js';
import { restrictUser } from '../middlewares/verifyToken.middlewares.js';

const movieRouter = express.Router();

movieRouter.get('/', restrictUser(["ADMIN", "NORMAL"]), getMovies);
movieRouter.post('/', restrictUser(["ADMIN"]), registerMovie);
movieRouter.get('/:id', restrictUser(["ADMIN"]), getMovieById);
movieRouter.put('/:id', restrictUser(["ADMIN"]), updateMovieById);
movieRouter.delete('/:id', restrictUser(["ADMIN"]), deleteMovieById);

export default movieRouter;
