import express from 'express';
import { deleteMovieById, getMovieById, getMovies, registerMovie, updateMovieById } from '../controllers/movie.controller.js';
import { restrictUser } from '../middlewares/verifyToken.middlewares.js';
import { upload } from '../middlewares/uploadFile.middlewares.js';

const movieRouter = express.Router();

movieRouter.get('/', restrictUser(["ADMIN", "NORMAL"]), getMovies);
movieRouter.post('/', restrictUser(["ADMIN"]), upload.single("file"), registerMovie);
movieRouter.get('/:id', restrictUser(["ADMIN"]), getMovieById);
movieRouter.put('/:id', restrictUser(["ADMIN"]), upload.single("file"), updateMovieById);
movieRouter.delete('/:id', restrictUser(["ADMIN"]), deleteMovieById);

export default movieRouter;
