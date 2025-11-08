import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../configs/db.js';

const collection = db.collection('users');

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const query = {
            $or: [{ email }, { username }],
        };
        const existingUser = await collection.findOne(query);
        if (existingUser) {
            return next({
                status: 422,
                message: 'Email or Username is already registered.',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            username,
            email,
            password: hashedPassword,
            role: 'customer',
            watchlist: [],
            reviews: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        
        const { insertedId } = await collection.insertOne(user);
        const token = jwt.sign({ id: insertedId, role: user.role }, process.env.AUTH_SECRET);
        user._id = insertedId;
        const { password: pass, updatedAt, createdAt, ...rest } = user;
        res
            .cookie('raul_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next({ status: 500, error });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await collection.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next({ status: 401, message: 'Email atau password salah' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.AUTH_SECRET);
        const { username } = user;
        res
            .cookie('raul_token', token, { httpOnly: true, path: '/' })
            .status(200)
            .json({ username });
    } catch (error) {
        next({ status: 500, error });
    }
};

export const logout = async (req, res, next) => {
    try {
        res
        .clearCookie('raul_token', {
            path: '/',
        })
        .status(200)
        .json({ message: 'Logout berhasil' });
    } catch (error) {
        next({ status: 500, error });
    }
};