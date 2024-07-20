import { restrictUser } from "../src/middlewares/verifyToken.middlewares.js";
import { expect } from "chai";
import sinon from "sinon";

describe('Middleware - restrictUser', function () {
    it('should allow access if the user has one of the allowed roles', async function () {
        const roles = ['ADMIN'];
        const userRole = 'ADMIN';

        const req = {
            user: {
                user: {
                    role: userRole
                }
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        const next = sinon.stub();

        restrictUser(roles)(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should deny access if the user does not have any of the allowed roles', async function () {
        const roles = ['USER'];
        const userRole = 'ADMIN'; // Role not included in the allowed roles

        // Simulate a request object with a user having a role not included in the allowed roles
        const req = {
            user: {
                user: {
                    role: userRole
                }
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        const next = sinon.stub();

        restrictUser(roles)(req, res, next);

        expect(next.calledOnce).to.be.false;

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: 'Unauthorized' })).to.be.true;
    });

    it('should deny access if the user object is missing', async function () {
        const roles = ['ADMIN'];

        const req = {
            user: {
                user: {}
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        const next = sinon.stub();

        restrictUser(roles)(req, res, next);

        expect(next.calledOnce).to.be.false;

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: 'Unauthorized' })).to.be.true;
    });
});
