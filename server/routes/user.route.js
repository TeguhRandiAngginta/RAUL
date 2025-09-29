import express from 'express';

import{
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} from  '../controllers/user.controller.js';
import { authenticateToken } from '../configs/middleware.js';
import { getUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

// Endpoint untuk mendapatkan profil user berdasarkan token
router.get('/profile', authenticateToken, getUserProfile);

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;