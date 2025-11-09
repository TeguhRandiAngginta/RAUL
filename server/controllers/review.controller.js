import { db } from '../configs/db.js';
import { ObjectId } from 'mongodb';

const reviewsCollection = db.collection('reviews');
const usersCollection = db.collection('users');

// Membuat review baru
export const createReview = async (req, res, next) => {
        try {
                const { tmdbMovieId, rating, comment } = req.body;
                const userId = req.user.id;

                // Validasi input
                if (!tmdbMovieId || !rating || !comment) {
                        return res.status(400).json({ message: 'Semua field harus diisi' });
                }

                // Validasi rating
                if (rating < 1 || rating > 5) {
                        return res.status(400).json({ message: 'Rating harus antara 1-5' });
                }

                // Cek apakah user sudah review film ini
                const existingReview = await reviewsCollection.findOne({
                        userId: new ObjectId(userId),
                        tmdbMovieId: Number(tmdbMovieId)
                });

                if (existingReview) {
                        return res.status(400).json({
                                message: 'Anda sudah memberi review untuk film ini'
                        });
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
                const result = await reviewsCollection.insertOne(newReview);

                // Ambil data user untuk response
                const user = await usersCollection.findOne(
                        { _id: new ObjectId(userId) },
                        { projection: { username: 1 } }
                );

                // Return review dengan data user
                res.status(201).json({
                        ...newReview,
                        _id: result.insertedId,
                        user: {
                                _id: user._id,
                                username: user.username
                        }
                });

        } catch (error) {
                console.error('Error creating review:', error);
                next({ status: 500, message: error.message });
        }
};

// Mendapatkan semua review untuk 1 film (DENGAN DATA USER)
export const getReviewsForMovie = async (req, res, next) => {
        try {
                const tmdbMovieId = Number(req.params.movieId);

                // GUNAKAN AGGREGATE dengan LOOKUP untuk JOIN data user
                const reviews = await reviewsCollection.aggregate([
                        { $match: { tmdbMovieId } },
                        {
                                $lookup: {
                                        from: 'users',
                                        localField: 'userId',
                                        foreignField: '_id',
                                        as: 'user'
                                }
                        },
                        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                        {
                                $project: {
                                        _id: 1,
                                        tmdbMovieId: 1,
                                        rating: 1,
                                        comment: 1,
                                        createdAt: 1,
                                        updatedAt: 1,
                                        'user._id': 1,
                                        'user.username': 1
                                }
                        },
                        { $sort: { createdAt: -1 } }
                ]).toArray();

                res.status(200).json(reviews);

        } catch (error) {
                console.error('Error getting reviews:', error);
                next({ status: 500, message: error.message });
        }
};

// Mendapatkan review milik user yang login
export const getMyReviews = async (req, res, next) => {
        try {
                const userId = req.user.id;

                const reviews = await reviewsCollection.aggregate([
                        { $match: { userId: new ObjectId(userId) } },
                        {
                                $lookup: {
                                        from: 'users',
                                        localField: 'userId',
                                        foreignField: '_id',
                                        as: 'user'
                                }
                        },
                        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                        {
                                $project: {
                                        _id: 1,
                                        tmdbMovieId: 1,
                                        rating: 1,
                                        comment: 1,
                                        createdAt: 1,
                                        updatedAt: 1,
                                        'user._id': 1,
                                        'user.username': 1
                                }
                        },
                        { $sort: { createdAt: -1 } }
                ]).toArray();

                res.status(200).json(reviews);
        } catch (error) {
                console.error('Error getting my reviews:', error);
                next({ status: 500, message: error.message });
        }
};