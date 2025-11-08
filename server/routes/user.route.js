import express from 'express';

import{
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserProfile,
    toggleWatchlist,
    getWatchlist
} from  '../controllers/user.controller.js';
import { authenticateToken } from '../configs/middleware.js';

const router = express.Router();

// Endpoint untuk mendapatkan profil user berdasarkan token
router.get('/profile', authenticateToken, getUserProfile);

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/update/:id', authenticateToken, updateUser);
router.delete('/delete/:id', authenticateToken, deleteUser);

router.post('/watchlist/toggle', authenticateToken, toggleWatchlist);
router.get('/watchlist/me', authenticateToken, getWatchlist);

export default router;