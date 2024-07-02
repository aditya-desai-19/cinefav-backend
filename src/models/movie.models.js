import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    imdbRating: {
        type: Number,
        required: true
    }, 
    genre: {
        type: String,
        required: false
    },
    deleted: {
        type: Boolean, 
        required: true,
        default: false
    }
}, {timestamps: true});

export const Movie = mongoose.model("Movie", movieSchema);