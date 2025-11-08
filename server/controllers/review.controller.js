import { db } from '../configs/db.js';
import { ObjectId } from 'mongodb';

const collection = db.collection('reviews');

// Membuat review baru
export const createReview = async (req, res, next) => {
    try {
        const { tmdbMovieId, rating, comment } = req.body;
        const userId = req.user.id; // Didapat dari middleware autentikasi

        // Validasi input
        if (!tmdbMovieId || !rating || !comment) {
            return next({ status: 400, message: 'Semua field harus diisi' });
        }

        const newReview = {
            userId: new ObjectId(userId),
            tmdbMovieId: Number(tmdbMovieId),
            rating: Number(rating),
            comment,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Simpan ke koleksi 'reviews'
        const result = await collection.insertOne(newReview);
        res.status(201).json({ ...newReview, _id: result.insertedId });

    } catch (error) {
        next({ status: 500, error });
    }
};

// Mendapatkan semua review untuk 1 film
export const getReviewsForMovie = async (req, res, next) => {
    try {
        const tmdbMovieId = Number(req.params.movieId);

        // Cari semua review berdasarkan tmdbMovieId
        const reviews = await collection.find({ tmdbMovieId }).toArray();
        res.status(200).json(reviews);

    } catch (error) {
        next({ status: 500, error });
    }
};

export const getMyReviews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviews = await collection.find({ userId: new ObjectId(userId) }).toArray();
        res.status(200).json(reviews);
    } catch (error) {
        next({ status: 500, error });
    }
};