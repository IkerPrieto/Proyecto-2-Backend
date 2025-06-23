const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys');

const UserController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).send({ message: 'All fields are obligatory' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ ...req.body, password: hashedPassword });
            res.status(201).send({ message: 'User created successfully', user });
        } catch (error) {
            console.error('Error with register', error);
            res.status(500).send({ message: 'Error creating user', error });
        }
    },

    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).send({ message: 'User or password are not correct' });
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).send({ message: 'User or password are not correct' });
            }

            const token = jwt.sign({ _id: user._id }, jwt_secret);

            if (!user.tokens) user.tokens = [];
            if (user.tokens.length >= 3) user.tokens.shift();
            user.tokens.push(token);
            await user.save();

            res.send({ message: 'Login successfully', token, user });
        } catch (error) {
            console.error('Error while login', error);
            res.status(500).send({ message: 'Error while logging in', error });
        }
    },

    async getCurrentUser(req, res) {
        try {
            const user = await req.user;
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({ message: 'Server error while fetching current user', error });
        }
    },

    async logout(req, res) {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).send({ message: 'Token not given' });
            }

            const user = await User.findOne({tokens:token});

            if(!user) {
                return res.status(401).json({message: "User not found"});
            }

            user.tokens = user.tokens.filter((t) => t !== token);
            await user.save();

            res.status(200).send({message: "Logout successfully"});

            // const deleted = await token.destroy({ where: { token } });

            // if (deleted) {
            //     return res.send({ message: 'Session closed successfully' });
            // } else {
            //     return res.status(400).send({ message: 'Token not founded or already destroyed' });
            // }
        } catch (error) {
            console.error('Error while logout', error);
            res.status(500).send({ message: 'Error while loggout', error });
        }
    }
}

module.exports = UserController;