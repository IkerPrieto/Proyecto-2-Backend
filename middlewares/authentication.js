const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys');

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: 'No token provided' });
    }

    const payload = jwt.verify(token, jwt_secret);


    const user = await User.findOne({
      _id: payload._id,
      tokens: token,
    });

    if (!user) {
      return res.status(401).send({ message: 'User not found' });
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