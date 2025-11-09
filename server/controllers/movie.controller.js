import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// HELPER: parameter standar untuk setiap panggilan TMDB
const tmdbParams = (params = {}) => {
    return {
        params: {
            api_key: API_KEY,
            language: 'id-ID',
            ...params // Gabungkan dengan parameter tambahan
        }
    };
};

// Fungsi untuk mengambil film populer
export const getPopularMovies = async (req, res, next) => {
    try {
        const page = req.query.page || 1; 
        
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: 'id-ID',
                page: page,
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
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
                append_to_response: 'credits,videos'
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};

export const discoverMovies = async (req, res, next) => {
    try {
        const { page, genre, year } = req.query;
        
        // Siapkan parameter filter
        let filterParams = { 
            page: page || 1,
            sort_by: 'popularity.desc' // Selalu urutkan berdasarkan popularitas
        };
        
        if (genre) filterParams.with_genres = genre;
        if (year) filterParams.primary_release_year = year; 

        const response = await axios.get(`${BASE_URL}/discover/movie`, tmdbParams(filterParams));
        res.status(200).json(response.data);

    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};


export const getGenres = async (req, res, next) => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, tmdbParams());
        res.status(200).json(response.data.genres); 
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};


export const searchMovies = async (req, res, next) => {
    try {
        const { query, page } = req.query;

        if (!query) {
            return next({ status: 400, message: 'Query pencarian "query" diperlukan' });
        }

        const response = await axios.get(
            `${BASE_URL}/search/movie`, 
            tmdbParams({ query, page: page || 1 })
        );
        res.status(200).json(response.data);
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};