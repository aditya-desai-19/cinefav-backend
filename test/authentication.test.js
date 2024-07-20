import { expect } from "chai";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../constants.js";
import { verifyToken } from "../src/middlewares/verifyToken.middlewares.js";
import sinon from "sinon";

describe('Middleware - verifyToken', function () {

    it('should allow access if a valid token is provided', async function () {
        const token = jwt.sign({ username: 'testUser' }, SECRET_KEY, { expiresIn: '1h' });

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        const next = sinon.stub();

        // Apply the verifyToken middleware
        verifyToken()(req, res, next);

        // Expect the next middleware to be called
        expect(next.calledOnce).to.be.true;
    });

    it('should deny access if no token is provided', async function () {
        const req = {
            headers: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        const next = sinon.stub();

        // Apply the verifyToken middleware
        verifyToken()(req, res, next);

        // Expect the response to be sent with a 401 status and a No token provided message
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Please authenticate yourself' })).to.be.true;
    });

    it('should deny access if an invalid token is provided', async function () {
        const token = 'e5678000rfkt';

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        const next = sinon.stub();

        // Apply the verifyToken middleware
        verifyToken()(req, res, next);

        // Expect the response to be sent with a 403 status and an Invalid token message
        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: 'Invalid token' })).to.be.true;
    });
});
