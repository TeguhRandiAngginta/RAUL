import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// Fungsi untuk mengambil film populer
export const getPopularMovies = async (req, res, next) => {
    try {
        const page = req.query.page || 1; // Ambil 'page' dari query, default 1
        
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: 'id-ID',
                page: page,
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        // Jika error, teruskan ke error handler
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};

// Fungsi untuk mengambil detail satu film
export const getMovieDetails = async (req, res, next) => {
    try {
        const { id } = req.params; // Ambil ID film dari parameter URL
        
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                language: 'id-ID',
                append_to_response: 'credits,videos' // (Opsional) ambil data cast & trailer
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};