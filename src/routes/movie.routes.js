import express from 'express';
import { deleteMovieById, getMovieById, getMovies, registerMovie, updateMovieById } from '../controllers/movie.controller.js';
import { restrictUser } from '../middlewares/verifyToken.middlewares.js';

const movieRouter = express.Router();

movieRouter.get('/',getMovies);
movieRouter.post('/', restrictUser("ADMIN"), registerMovie);
movieRouter.get('/', restrictUser("ADMIN"), getMovieById);
movieRouter.put('/', restrictUser("ADMIN"), updateMovieById);
movieRouter.delete('/', restrictUser("ADMIN"), deleteMovieById);

export default movieRouter;
