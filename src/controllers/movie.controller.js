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
        const { title, description, imdbRating, genre } = req.body;

        if(!title || !description || !imdbRating || !genre || !req?.file) {
            return res.status(404).json({ msg: "Fields can't be empty" });
        }

        const base64URL = getBase64URL(req.file);
        if(!base64URL) {
            return res.status(500).json({ msg: "Something went wrong" });
        }

        const moviePoster = await uploadImage(base64URL);

        const movie = new Movie({
            title: title,
            description: description,
            poster: moviePoster.url,
            imdbRating: imdbRating,
            genre: genre
        });

        await movie.save();

        return res.status(201).json({ msg: "Movie saved successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const getMovieById = async (req, res) => { 
    try {
        if(!req.params.id) {
            return res.status(400).json({ msg: "Bad request" });
        }

        const { id } = req.params;
        const movie = await Movie.findById({ _id: id });

        if(!movie) {
            return res.status(404).json({ msg: "Movie not found" });
        }

        return res.status(200).json({ movie });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const updateMovieById = async (req, res) => {
    try {
        if(!req.params.id) {
            return res.status(400).json({ msg: "Bad request" });
        }

        if(!req.body.title || !req.body.description || !req.body.imdbRating || !req.body.genre) {
            return res.status(400).json({ msg: "Bad request" });
        }

        const { id } = req.params;
        const { title, description, imdbRating, genre } = req.body;

        let base64URL;
        if(req.file) {
            base64URL = getBase64URL(req.file);
            if(!base64URL) {
                return res.status(500).json({ msg: "Something went wrong" });
            }
        }

        let moviePoster; 
        if(base64URL) {
            moviePoster = await uploadImage(base64URL);
        }

        const movie = await Movie.findById({ _id: id });
        
        if(!movie) {
            return res.status(404).json({ msg: "Movie not found" });
        }

        movie.title = title || movie.title;
        movie.description = description || movie.description;
        movie.poster = moviePoster?.url || movie.poster;
        movie.imdbRating = imdbRating || movie.imdbRating;
        movie.genre = genre || movie.genre;

        await movie.save();

        return res.status(200).json({ msg: "Movie updated successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const deleteMovieById = async (req, res) => {
    try {
        if(!req.params.id) {
            return res.status(400).json({ msg: "Bad request" });
        }

        const { id } = req.params;  

        const movie = await Movie.findById({ _id: id });

        if(!movie) {
            return res.status(404).json({ msg: "Movie not found" });
        }

        movie.deleted = true;

        await movie.save();
        
        return res.status(200).json({ msg: "Successfully deleted the movie" });
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export { getMovies, registerMovie, getMovieById, updateMovieById, deleteMovieById }