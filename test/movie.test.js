import { expect } from 'chai';
import sinon from 'sinon';
import { getMovies, registerMovie } from '../src/controllers/movie.controller.js';
import { Movie } from '../src/models/movie.models.js';

describe('Movie controller methods test', function () {
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
                poster: "test.jpg"
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