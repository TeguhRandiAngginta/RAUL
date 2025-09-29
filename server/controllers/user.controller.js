import { db } from '../configs/db.js';
import { ObjectId } from 'mongodb';
import bcrypt from "bcrypt";

const collection = await db.collection('users');

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await collection.findOne({ _id: new ObjectId(req.user.id) });
        if (!user) return next({ status: 404, message: 'User not found' });

        const { password, ...userData } = user; // Hilangkan password dari respons
        res.status(200).json(userData);
    } catch (error) {
        next({ status: 500, error });
    }
};


export const getUsers = async (req, res) => {
    let result = await collection.find({}).toArray();
    res.status(200).json(result);
};

export const getUser = async (req, res, next) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const user = await collection.findOne(query);
        if (!user) {
            return next({ status: 404, message: 'User not found!' });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, error });
    }
};

export const updateUser = async (req, res, next) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const query = { _id: new ObjectId(req.params.id) };
        const data = {
            $set: {
                ...req.body,
                updatedAt: new Date().toISOString(),
            },
        };
        const options = {
            returnDocument: 'after',
        };
        const updateUser = await collection.findOneAndUpdate(query, data, options);
        const { password: pass, updatedAt, createdAt, ...rest } = updateUser;
        res.status(200).json(updateUser)
    } catch (error) {
        next({ status: 500, error })
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        await collection.deleteOne(query);
        res.status(200).json({ message: "User has been deleted!" });
    } catch (error) {
        next({ status: 500, error });
    }
}
