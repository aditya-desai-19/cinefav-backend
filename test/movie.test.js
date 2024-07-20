import { expect } from 'chai';
import sinon from 'sinon';
import { deleteMovieById, getMovieById, getMovies, registerMovie, updateMovieById } from '../src/controllers/movie.controller.js';
import { Movie } from '../src/models/movie.models.js';

describe('Movie controller methods test', function () {
    describe('getMovies',  () => {
        it('should get me all the movies', async function () {
            const dummyMovies = [{ _id: '1', title: 'Test Movie' }];
            const findStub = sinon.stub(Movie, 'find').resolves(dummyMovies);
    
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            await getMovies({}, res);
    
            // Assertions
            expect(findStub.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ movies: dummyMovies })).to.be.true;
    
            // Restore the stub
            findStub.restore();
        })
    })

    describe('registerMovie', () => {
        it('should add a movie to database', async function () {
            const req = {
                body: {
                    title: "Test Movie",
                    description: "Test Movie description",
                    poster: "test.jpg",
                    imdbRating: 9.0
                }
            }
    
            const saveStub = sinon.stub(Movie.prototype, 'save');
    
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            await registerMovie(req, res);
    
            expect(saveStub.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ msg: "Movie saved successfully" })).to.be.true;
    
            saveStub.restore();
    
        })
    
        it('should not add a movie to database', async function () {
            const req = {
                body: {
                    title: "Test Movie",
                    description: "Test Movie description",
                }
            }
    
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            await registerMovie(req, res);
    
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: "Fields can't be empty" })).to.be.true;
        })
    })

    //getMovieById
    describe('getMovieById', () => {
        let req, res, movieMock;
    
        beforeEach(() => {
            req = {
                params: {
                    id: '60d6b3c476efff47f8f9a0a8'
                }
            };
    
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            movieMock = sinon.mock(Movie);
        });
    
        afterEach(() => {
            movieMock.restore();
        });
    
        it('should return 400 if id is not provided', async () => {
            req.params.id = null;
    
            await getMovieById(req, res);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: 'Bad request' })).to.be.true;
        });
    
        it('should return 404 if movie is not found', async () => {
            movieMock.expects('findById').withArgs({ _id: req.params.id }).resolves(null);
    
            await getMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Movie not found' })).to.be.true;
        });
    
        it('should return the movie and 200 status', async () => {
            const movie = new Movie({
                _id: req.params.id,
                title: 'Some Title',
                description: 'Some Description',
                poster: 'Some Poster',
                imdbRating: 7.0,
                genre: 'Some Genre'
            });
    
            movieMock.expects('findById').withArgs({ _id: req.params.id }).resolves(movie);
    
            await getMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ movie })).to.be.true;
        });
    
        it('should return 500 if an error occurs', async () => {
            movieMock.expects('findById').withArgs({ _id: req.params.id }).rejects(new Error('Something went wrong'));
    
            await getMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'Something went wrong' })).to.be.true;
        });
    });
    

    //updateMovieById
    describe('updateMovieById', () => {
        let req, res, movieMock;
    
        beforeEach(() => {
            req = {
                params: {
                    id: '60d6b3c476efff47f8f9a0a8'
                },
                body: {
                    title: 'Updated Title',
                    description: 'Updated Description',
                    poster: 'Updated Poster',
                    imdbRating: 8.5,
                    genre: 'Updated Genre'
                }
            };
    
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            movieMock = sinon.mock(Movie);
        });
    
        afterEach(() => {
            movieMock.restore();
        });
    
        it('should return 400 if id is not provided', async () => {
            req.params.id = null;
    
            await updateMovieById(req, res);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: 'Bad request' })).to.be.true;
        });
    
        it('should return 400 if required fields are missing', async () => {
            req.body.title = null;
    
            await updateMovieById(req, res);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: 'Bad request' })).to.be.true;
        });
    
        it('should return 404 if movie is not found', async () => {
            movieMock.expects('findById').withArgs({ _id: req.params.id }).resolves(null);
    
            await updateMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Movie not found' })).to.be.true;
        });
    
        it('should update the movie and return 200', async () => {
            const movie = new Movie({
                _id: req.params.id,
                title: 'Old Title',
                description: 'Old Description',
                poster: 'Old Poster',
                imdbRating: 7.0,
                genre: 'Old Genre'
            });
    
            movieMock.expects('findById').withArgs({ _id: req.params.id }).resolves(movie);
    
            await updateMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: 'Movie updated successfully' })).to.be.true;
        });
    
        it('should return 500 if an error occurs', async () => {
            movieMock.expects('findById').withArgs({ _id: req.params.id }).rejects(new Error('Something went wrong'));
    
            await updateMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'Something went wrong' })).to.be.true;
        });
    });

    //deleteMovieById
    describe('deleteMovieById', () => {
        let req, res, movieMock;
    
        beforeEach(() => {
            req = {
                params: {
                    id: '60d6b3c476efff47f8f9a0a8'
                }
            };
    
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            movieMock = sinon.mock(Movie);
        });
    
        afterEach(() => {
            movieMock.restore();
        });
    
        it('should return 400 if id is not provided', async () => {
            req.params.id = null;
    
            await deleteMovieById(req, res);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ msg: 'Bad request' })).to.be.true;
        });
    
        it('should return 404 if movie is not found', async () => {
            movieMock.expects('findById').withArgs({ _id: req.params.id }).resolves(null);
    
            await deleteMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ msg: 'Movie not found' })).to.be.true;
        });
    
        it('should mark the movie as deleted and return 200', async () => {
            const movie = new Movie({
                _id: req.params.id,
                title: 'Some Title',
                description: 'Some Description',
                poster: 'Some Poster',
                imdbRating: 7.0,
                genre: 'Some Genre',
                deleted: false
            });
    
            movieMock.expects('findById').withArgs({ _id: req.params.id }).resolves(movie);
    
            await deleteMovieById(req, res);
    
            movieMock.verify();
            expect(movie.deleted).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ msg: 'Successfully deleted the movie' })).to.be.true;
        });
    
        it('should return 500 if an error occurs', async () => {
            movieMock.expects('findById').withArgs({ _id: req.params.id }).rejects(new Error('Something went wrong'));
    
            await deleteMovieById(req, res);
    
            movieMock.verify();
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ msg: 'Something went wrong' })).to.be.true;
        });
    });
})