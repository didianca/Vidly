const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT',async () => {
        const user = {
            _id: mongoose.Types.ObjectId(),
            isAdmin: true,
            iat: Math.floor(Date.now() / 1000) - 30
        };
        const token = await new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
        auth(req, res, next);
        expect(req.user.toString()).toMatch(user.toString());
    })
});