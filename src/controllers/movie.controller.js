import { Movie } from "../models/movie.models.js";

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        return res.status(200).json({ movies });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const registerMovie = async (req, res) => {
    try {
        const { title, description, poster, imdbRating } = req.body;

        if(!title || !description || !poster || !imdbRating) {
            return res.status(404).json({ msg: "Fields can't be empty" });
        }

        const movie = new Movie({
            title: title,
            description: description,
            poster: poster,
            imdbRating: imdbRating
        });

        await movie.save();

        return res.status(201).json({ msg: "Movie saved successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const getMovieById = async (req, res) => { 
    try {
        const id = req.query.id;
        const movie = await Movie.findById({ _id: id });
        return res.status(200).json({ movie });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const updateMovieById = async (req, res) => {
    try {
        const id = req.query.id;
        const { title, description, poster, imdbRating, genre } = req.body;

        const movie = await Movie.findById({ _id: id });
        
        if(!movie) {
            return res.status(404).json({ msg: "Movie not found" });
        }

        movie.title = title ? title : movie.title;
        movie.description = description ? description : movie.description;
        movie.poster = poster ? poster: movie.poster;
        movie.imdbRating = imdbRating ? imdbRating : movie.imdbRating;
        movie.genre = genre ? genre : movie.genre;

        await movie.save();

        return res.status(200).json({ msg: "Movie updated successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export { getMovies, registerMovie, getMovieById, updateMovieById }