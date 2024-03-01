const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

module.exports.register = async (req, res, next) => {
    const { username, password, email, first_name, last_name, address, phone } = req.body;
    try {
        // validation
        if (!(username && password && email && first_name && last_name && address && phone)) {
            return next(new Error('Fulfill all inputs'));
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const data = {
            username,
            password: hashedPassword,
            email,
            first_name,
            last_name,
            address,
            phone: parseInt(phone) // Convert phone to integer
        };

        // Create user in database
        const newUser = await db.user.create({
            data
        });

        res.json({ msg: 'Register successful', user: newUser });
    } catch (err) {
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        // validation
        if (!(username.trim() && password.trim())) {
            throw new Error('Username or password must not be blank');
        }
        // find username in db.user
        const user = await db.user.findFirstOrThrow({ where: { username } });
        // check password
        const pwOk = await bcrypt.compare(password, user.password);
        if (!pwOk) {
            throw new Error('Invalid login');
        }
        // issue jwt token 
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

exports.getme = (req, res, next) => {
    res.json(req.user);
};
