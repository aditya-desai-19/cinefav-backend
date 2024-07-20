import { expect } from "chai";
import sinon from 'sinon';
import { Watchlist } from "../src/models/watchlist.models.js";
import { getMoviesFromWatchlist, addMovieToWatchlist, removeMovieFromWatchlist } from "../src/controllers/watchlist.controller.js";

describe('Test cases for watchlist', () => {
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };

    const next = sinon.stub();

    it('should return watchlist', async () => {
        const req = {
            params: {
                id: 1
            }
        }

        const watchlist = {
            _id: 1,
            movies: [],
            user: 123
        };

        sinon.stub(Watchlist, 'findOne').resolves(watchlist);

        await getMoviesFromWatchlist(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ watchlist }));
    })

    it('should return 400 error for watchlist', async () => {
        const req = {
            params: {
                
            }
        }

        await getMoviesFromWatchlist(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
    })
})

describe('addMovieToWatchlist', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                movie: { _id: 'movieId', title: 'testMovie' },
                id: 'userId'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if request is invalid', async () => {
        req.body = {}; // Invalid request with missing movie and id

        await addMovieToWatchlist(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ msg: "Invalid request" })).to.be.true;
    });

    it('should create a new watchlist if none exists for the user', async () => {
        sinon.stub(Watchlist, 'findOne').resolves(null);
        const saveStub = sinon.stub(Watchlist.prototype, 'save').resolves();

        await addMovieToWatchlist(req, res, next);

        expect(saveStub.calledOnce).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({ msg: "Movie added to watchlist" })).to.be.true;
    });

    it('should add a movie to an existing watchlist if it is not already present', async () => {
        const watchlist = {
            movies: [],
            save: sinon.stub().resolves()
        };
        sinon.stub(Watchlist, 'findOne').resolves(watchlist);

        await addMovieToWatchlist(req, res, next);

        expect(watchlist.save.calledOnce).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({ msg: "Movie added to watchlist" })).to.be.true;
    });

    it('should return 500 if movie is already present in the watchlist', async () => {
        const watchlist = {
            movies: [{ _id: 'movieId', title: 'testMovie' }],
            save: sinon.stub().resolves()
        };
        sinon.stub(Watchlist, 'findOne').resolves(watchlist);

        await addMovieToWatchlist(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ msg: "Movie already present in watchlist" })).to.be.true;
    });

    it('should return 500 if there is an error during the process', async () => {
        sinon.stub(Watchlist, 'findOne').rejects(new Error('Database error'));

        await addMovieToWatchlist(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ msg: "Something went wrong" })).to.be.true;
    });
});


describe('removeMovieFromWatchlist', () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                id: 'watchlistId'
            },
            body: {
                movieId: 'movieId'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if request is invalid', async () => {
        req.body = {}; // Invalid request with missing movieId

        await removeMovieFromWatchlist(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ msg: "Invalid request" })).to.be.true;
    });

    it('should return 400 if watchlist is not found', async () => {
        sinon.stub(Watchlist, 'findOne').resolves(null);

        await removeMovieFromWatchlist(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ msg: "Invalid request" })).to.be.true;
    });

    it('should return 400 if movie is not found in the watchlist', async () => {
        const watchlist = {
            movies: [],
            save: sinon.stub().resolves()
        };
        sinon.stub(Watchlist, 'findOne').resolves(watchlist);

        await removeMovieFromWatchlist(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ msg: "Movie not found in watchlist" })).to.be.true;
    });

    it('should remove the movie from the watchlist and return 200 if successful', async () => {
        const watchlist = {
            movies: [{ _id: 'movieId', title: 'testMovie' }],
            save: sinon.stub().resolves()
        };
        sinon.stub(Watchlist, 'findOne').resolves(watchlist);

        await removeMovieFromWatchlist(req, res, next);

        expect(watchlist.movies.length).to.equal(0);
        expect(watchlist.save.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ msg: "Successfully removed movie from watchlist" })).to.be.true;
    });

    it('should return 500 if there is an error during the process', async () => {
        sinon.stub(Watchlist, 'findOne').rejects(new Error('Database error'));

        await removeMovieFromWatchlist(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ msg: "Something went wrong" })).to.be.true;
    });
});
