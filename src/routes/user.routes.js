import express from 'express';
import { registerUser, authenticateUser } from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.post('/signin', registerUser);
userRouter.post('/login', authenticateUser)

export default userRouter;