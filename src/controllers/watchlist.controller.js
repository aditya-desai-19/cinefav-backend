import { Watchlist } from "../models/watchlist.models.js";

const getMoviesFromWatchlist = async (req, res) => {
    try {
        const { id } = req.params;

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
            const movieIds = [];
            for(let i = 0; i < watchlist.movies.length; i++) {
                movieIds.push(watchlist.movies[i]?._id);
            }

            //checking if movie is already present
            if(!movieIds.includes(movie?._id)) {
                watchlist.movies = [...watchlist.movies, movie];
                await watchlist.save();
                return res.status(201).json({ msg: "Movie added to watchlist" });
            }

            return res.status(500).json({ msg: "Movie already present in watchlist" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const removeMovieFromWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;

        if(!movieId) {
            return res.status(400).json({ msg: "Invalid request" });
        }

        const watchlist = await Watchlist.findOne({ _id: req.params.id});

        if(watchlist === null) {
            return res.status(400).json({ msg: "Invalid request" });
        }

        const index = watchlist.movies.findIndex(x => x._id.toString() === movieId);

        if (index === -1) {
            return res.status(400).json({ msg: "Movie not found in watchlist" });
        }

        // Remove the movie from the array
        watchlist.movies.splice(index, 1);

        await watchlist.save();

        return res.status(200).json({ msg: "Successfully removed movie from watchlist" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export {getMoviesFromWatchlist, addMovieToWatchlist, removeMovieFromWatchlist }