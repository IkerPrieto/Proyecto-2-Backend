const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../config/keys')

const UserController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                return res.status(400).send({ message: 'All fields are obligatory' })
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ ...req.body, password: hashedPassword })
            res.status(201).send({ message: 'User created successfully', user })
        } catch (error) {
            res.status(500).send({ message: 'Error creating user', error })
        }
    },

    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).send({ message: 'User or password are not correct' })
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if (!isMatch) {
                return res.status(400).send({ message: 'User or password are not correct' })
            }

            const token = jwt.sign({ _id: user._id }, jwt_secret)

            if (!user.tokens) user.tokens = []
            if (user.tokens.length >= 3) user.tokens.shift()
            user.tokens.push(token)
            await user.save()

            res.send({ message: 'Login successful', token, user })
        } catch (error) {
            res.status(500).send({ message: 'Error while logging in', error })
        }
    },

    async logout(req, res) {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).send({ message: 'Token not given' });
            }

            const deleted = await Token.destroy({ where: { token } });

            if (deleted) {
                return res.send({ message: 'Session closed successfully' });
            } else {
                return res.status(400).send({ message: 'Token not founded or already destroyed' });
            }
        } catch (error) {
            res.status(500).send({ message: 'Error while loggout', error });
        }
    }
}

module.exports = UserController