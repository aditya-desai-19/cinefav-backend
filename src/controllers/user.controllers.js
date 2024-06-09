//@ts-check
import bcrypt from 'bcrypt';
import { User } from '../models/user.models.js';
import { SALT_ROUNDS, SECRET_KEY } from '../../constants.js';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    try {
        const isUserName = await User.findOne({ userName: req.body.userName });

        if (isUserName) {
            res.status(400).json({ message: "Username is already present" });
        }

        const isEmail = await User.findOne({ email: req.body.email });

        if (isEmail) {
            res.status(400).json({ message: "Email is already present" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: "New user has been created" });
    } catch (error) {
        console.log("Error creating user: ", error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

const authenticateUser = async(req, res) => {
    try {
        let user;
        user = await User.findOne({ email: req.body.userNameOrEmail });

        //check if user has entered username
        if(!user) {
            user = await User.findOne({ userName: req.body.userNameOrEmail });
        }

        if(user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if(isMatch) {
                const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24); 
                const token = jwt.sign({ name: user.userName, id: user._id, exp: expiration }, SECRET_KEY);
                return res.status(200).json({ message: "Login successful", token });
            } else {
                return res.status(400).json({ message: "User not found" });
            }
        }

    } catch (error) {
        console.log("Error authenticating user: ", error);
        return res.status(500).json({ message: "Error authenticating user" });
    }
}


export { registerUser, authenticateUser }