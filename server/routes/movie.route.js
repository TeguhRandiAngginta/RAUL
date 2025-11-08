import express from 'express';
import { getPopularMovies, getMovieDetails } from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/popular', getPopularMovies); // Endpoint untuk film populer
router.get('/:id', getMovieDetails);     // Endpoint untuk detail film

export default router;