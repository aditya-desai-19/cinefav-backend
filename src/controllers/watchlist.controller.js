import { Watchlist } from "../models/watchlist.models.js";

const getMoviesFromWatchlist = async (req, res) => {
    try {
        const { id } = req.query;

        if(!id) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const watchlist = await Watchlist.findOne({ user: id});
        return res.status(200).json({ watchlist });

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const addMovieToWatchlist = async (req, res) => {
    try {
        const { movie, id } = req.body;

        if(!movie || !id) {
            return res.status(400).json({ msg: "Invalid request" });
        }

        const watchlist = await Watchlist.findOne({ user: id});

        if(watchlist === null) {
            const newWatchlist = new Watchlist({
                movies : [movie],
                user: id
            })

            await newWatchlist.save();
        } else {
            watchlist.movies = [...watchlist.movies, movie];
            await watchlist.save();
        }
        return res.status(201).json({ msg: "Movie added to watchlist" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export {getMoviesFromWatchlist, addMovieToWatchlist }