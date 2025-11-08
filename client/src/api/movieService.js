import api from './api';

export const fetchPopularMovies = async (page = 1) => {
    try {
        const res = await api.get('/movies/popular', {
            params: {
                page, 
            },
        });
        return res.data;
    } catch (error) {
        console.error("Gagal mengambil data dari server:", error);
        throw error;
    }
};

// fungsi untuk mengambil detail
export const fetchMovieDetail = async (id) => {
    try {
        const res = await api.get(`/movies/${id}`);
        return res.data;
    } catch (error) {
        console.error("Gagal mengambil detail film:", error);
        throw error;
    }
};