import { db } from '../configs/db.js';
import { ObjectId } from 'mongodb';
import bcrypt from "bcrypt";

const collection = db.collection('users');

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await collection.findOne({ _id: new ObjectId(req.user.id) });
        if (!user) return next({ status: 404, message: 'User not found' });

        const { password, ...userData } = user;
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
        // const { password: pass, updatedAt, createdAt, ...rest } = updateUser;
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

export const toggleWatchlist = async (req, res, next) => {
    try {
        const { tmdbMovieId } = req.body;
        const userId = req.user.id;

        if (!tmdbMovieId) {
            return next({ status: 400, message: 'tmdbMovieId diperlukan' });
        }

        const numericMovieId = Number(tmdbMovieId);
        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return next({ status: 404, message: 'User not found' });
        }

        let updateOperation;
        let message;

        // Cek apakah film sudah ada di watchlist
        if (user.watchlist && user.watchlist.includes(numericMovieId)) {
            // Jika ada, hapus ($pull)
            updateOperation = { $pull: { watchlist: numericMovieId } };
            message = 'Dihapus dari watchlist';
        } else {
            // Jika tidak ada, tambahkan ($addToSet agar tidak duplikat)
            updateOperation = { $addToSet: { watchlist: numericMovieId } };
            message = 'Ditambahkan ke watchlist';
        }

        // Update dokumen user di database
        await collection.updateOne({ _id: new ObjectId(userId) }, updateOperation);
        
        res.status(200).json({ message });

    } catch (error) {
        next({ status: 500, error });
    }
};

export const getWatchlist = async (req, res, next) => {
    try {
        const userId = req.user.id; 

        const user = await collection.findOne(
            { _id: new ObjectId(userId) },
            { projection: { watchlist: 1 } } // ambil field watchlist
        );

        if (!user) {
            return next({ status: 404, message: 'User tidak ditemukan' });
        }
        
        res.status(200).json(user.watchlist || []); // Kirim array watchlist
    
    } catch (error) {
        next({ status: 500, error });
    }
};