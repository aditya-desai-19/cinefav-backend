import { expect } from 'chai';
import bcrypt from 'bcrypt';
import sinon from 'sinon';
import { registerUser, authenticateUser } from '../src/controllers/user.controllers.js';
import { User } from '../src/models/user.models.js';
import jwt from 'jsonwebtoken'

describe('Test cases for user controller', function () {

// describe('registerUser', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                userName: 'testUser',
                email: 'test@example.com',
                password: 'password123'
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

    it('should return 400 if username is already present', async () => {
        sinon.stub(User, 'findOne').resolves({ userName: 'testUser' });

        await registerUser(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: "Username is already present" })).to.be.true;
    });

    it('should return 400 if email is already present', async () => {
        sinon.stub(User, 'findOne').onFirstCall().resolves(null).onSecondCall().resolves({ email: 'test@example.com' });

        await registerUser(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: "Email is already present" })).to.be.true;
    });

    it('should create a new user if username and email are not present', async () => {
        sinon.stub(User, 'findOne').resolves(null);
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
        const saveStub = sinon.stub(User.prototype, 'save').resolves();

        await registerUser(req, res, next);

        expect(saveStub.calledOnce).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({ message: "New user has been created" })).to.be.true;
    });

    it('should return 500 if there is an error during user creation', async () => {
        sinon.stub(User, 'findOne').resolves(null);
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
        sinon.stub(User.prototype, 'save').rejects(new Error('Save error'));

        await registerUser(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: "Error creating user" })).to.be.true;
    });
});

describe('Test case for authentication of user', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                userNameOrEmail: 'test@example.com',
                password: 'password123'
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

    it('should return 200 and token if user is found and password matches', async () => {
        const user = {
            _id: 'userId',
            userName: 'testUser',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'user'
        };
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(bcrypt, 'compare').resolves(true);
        sinon.stub(jwt, 'sign').returns('fakeToken');

        await authenticateUser(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
            message: "Login successful",
            token: 'fakeToken'
        })).to.be.true;
    });

    it('should return 400 if user is found but password does not match', async () => {
        const user = {
            _id: 'userId',
            userName: 'testUser',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'user'
        };
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(bcrypt, 'compare').resolves(false);

        await authenticateUser(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: "User not found" })).to.be.true;
    });

    it('should return 404 if user is not found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        await authenticateUser(req, res, next);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: "User not found" })).to.be.true;
    });

    it('should return 500 if there is an error during authentication', async () => {
        sinon.stub(User, 'findOne').rejects(new Error('Database error'));

        await authenticateUser(req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: "Error authenticating user" })).to.be.true;
    });
});