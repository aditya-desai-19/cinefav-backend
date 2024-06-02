import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    movies: [{ type: Schema.ObjectId, ref: 'Movie' }],
    user: {
        type: Schema.ObjectId, 
        ref: 'User',
        required: true
    }
}, {timestamps: true});

export const Playlist = mongoose.model("Playlist", playlistSchema);