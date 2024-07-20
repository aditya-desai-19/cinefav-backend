import { Movie } from "../models/movie.models.js";
import { getBase64URL, uploadImage } from "../middlewares/uploadFile.middlewares.js";

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ deleted: false });
        return res.status(200).json({ movies });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const registerMovie = async (req, res) => {
    try {
        const { title, description, rating } = req.body;

        if(!title || !description || !rating || !req?.file) {
            return res.status(404).json({ msg: "Fields can't be empty" });
        }

        const base64URL = getBase64URL(req.file);
        const moviePoster = await uploadImage(base64URL);

        const movie = new Movie({
            title: title,
            description: description,
            poster: moviePoster.url,
            imdbRating: rating
        });

        await movie.save();

        return res.status(201).json({ msg: "Movie saved successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const getMovieById = async (req, res) => { 
    try {
        const { id } = req.params;
        const movie = await Movie.findById({ _id: id });
        return res.status(200).json({ movie });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const updateMovieById = async (req, res) => {
    try {
        const { id } = req.params;
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

const deleteMovieById = async (req, res) => {
    try {
        const { id } = req.params;   

        if(!id) {
            return res.status(404).json({ msg: "Invalid request" });
        }

        const movie = await Movie.findById({ _id: id });
        movie.deleted = true;

        await movie.save();
        
        return res.status(200).json({ msg: "Successfully deleted the movie" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export { getMovies, registerMovie, getMovieById, updateMovieById, deleteMovieById }