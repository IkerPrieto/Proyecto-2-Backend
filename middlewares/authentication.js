const { User, Token } = require('../models');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys');

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }

        const payload = jwt.verify(token, jwt_secret);

        const user = await User.findById(payload.id);

        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }

        const tokenFound = await Token.findOne({
            UserId: user._id,
            token: token,
        });

        if (!tokenFound) {
            return res.status(401).send({ message: 'You are not authorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
    }
}

const isAdmin = (req, res, next) => {
  const admins = ['admin', 'superadmin'];

  if (!admins.includes(req.user.role)) {
    return res.status(403).send({
      message: 'You are not authorized as any kind of admin',
    });
  }

  next();
};

module.exports = { authentication, isAdmin };