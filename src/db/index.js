import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("MONGODB connected !!");
    } catch (error) {
        console.log(`Connection to MONGODB failed... !`, error);
        throw error;
    }
};

export default connectToDB;