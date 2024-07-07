import express from 'express';
import { registerUser, authenticateUser } from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/signin', authenticateUser)

export default userRouter;