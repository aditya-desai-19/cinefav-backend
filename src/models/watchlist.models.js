import mongoose, { Schema } from "mongoose";

const watchlistSchema = new mongoose.Schema({
    movies: {type: Array},
    user: {
        type: Schema.ObjectId, 
        ref: 'User',
        required: true
    }
}, {timestamps: true});

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);