// src/api/movieService.js
import axios from "axios";

const API_KEY = "15050283b30a09e0018841fd5769b73b";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async (page = 1) => {
    try {
        const res = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: "id-ID",
                page,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Gagal mengambil data TMDB:", error);
        throw error;
    }
};
