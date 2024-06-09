import { Playlist } from "../models/playlist.models.js";

const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({});
        return res.status(200).json({ playlists });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const createPlaylist = async (req, res) => {
    try {
        const { name, description, userId } = req.body;

        if(!name || !userId) {
            return res.status(400).json({ msg: "Fields can't be empty" });
        }

        const playlist = new Playlist({
            name: name,
            description: description,
            movies: [],
            user: userId
        });

        await playlist.save();

        return res.status(201).json({ msg: "Playlist created successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const getPlaylistByUserId = async (req, res) => {
    try {
        const { userId } = req.body;

        if(!userId) {
            return res.status(404).json({ msg: "Fields can't be empty" });
        }

        const playlists = await Playlist.find({ user: userId});
        return res.status(200).json({ playlists });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.body;

        if(!id) {
            return res.status(404).json({ msg: "Fields can't be empty" });
        }

        const playlists = await Playlist.find({ _id: id});
        return res.status(200).json({ playlists });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const modifyPlaylist = async (req, res) => {
    try {
        const { id, movies } = req.body;

        if(!id || !movies.length) {
            return res.status(400).json({ msg: "Fields can't be empty" });
        }

        const playlist = await Playlist.findOne({ _id: id });
        playlist.movies = movies

        await playlist.save();

        return res.status(200).json({ msg: "Playlist saved successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export {getPlaylists, createPlaylist, getPlaylistById, getPlaylistByUserId, modifyPlaylist}