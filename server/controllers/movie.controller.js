import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// Parameter standard untuk TMDB requests
const tmdbParams = (params = {}) => {
    return {
        params: {
            api_key: API_KEY,
            language: 'id-ID', // Default bahasa Indonesia
            include_adult: false, // Default aman
            ...params // Timpa dengan parameter dinamis
        }
    };
};

// 1. Mengambil Film Populer
export const getPopularMovies = async (req, res, next) => {
    try {
        const page = req.query.page || 1; 
        // Gunakan helper
        const response = await axios.get(`${BASE_URL}/movie/popular`, tmdbParams({ page }));
        res.status(200).json(response.data);
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};

// 2. Mengambil Detail Film
export const getMovieDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        // A. Coba ambil data bahasa Indonesia
        const response = await axios.get(
            `${BASE_URL}/movie/${id}`, 
            tmdbParams({ append_to_response: 'credits,videos' })
        );

        let movieData = response.data;

        // B. LOGIKA FALLBACK: Jika overview kosong, ambil data bahasa Inggris
        if (!movieData.overview || movieData.overview.trim() === "") {
            try {
                const englishResponse = await axios.get(`${BASE_URL}/movie/${id}`, {
                    params: { api_key: API_KEY, language: 'en-US' } // Paksa bahasa Inggris
                });
                
                // Isi overview yang kosong dengan bahasa Inggris
                movieData.overview = englishResponse.data.overview;
                // Opsional: Isi tagline juga jika kosong
                if (!movieData.tagline) movieData.tagline = englishResponse.data.tagline;
                
            } catch (err) {
                console.log("Gagal mengambil fallback bahasa Inggris", err.message);
            }
        }
        
        res.status(200).json(movieData);
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};

// 3. Discover Movies 
export const discoverMovies = async (req, res, next) => {
    try {
        const { page, genre, year, isAdult } = req.query;
        
        // Logika untuk mengubah string 'true'/'false' menjadi boolean
        const showAdultContent = isAdult === 'true';

        let filterParams = { 
            page: page || 1,
            sort_by: 'popularity.desc',
            // include_adult: true hanya untuk pornografi. 
            // set false secara default agar aplikasi tetap "bersih", 
            include_adult: false 
        };
        
        if (genre) filterParams.with_genres = genre;
        if (year) filterParams.primary_release_year = year; 

        // --- LOGIKA FILTER UMUR (CERTIFICATION) ---
        // Jika User TIDAK mengaktifkan mode dewasa (isAdult = false/undefined),
        // konten dibatasi hanya sampai PG-13.
        if (!showAdultContent) {
            filterParams.certification_country = 'US';
            filterParams['certification.lte'] = 'PG-13'; 
            // BLOKIR Genre Dewasa/Keras (Sama seperti logika Search)
            const forbiddenGenres = "27,80,53,10749";
            
            // Jika user sedang memfilter salah satu genre ini, jangan gunakan without_genres
            // (agar tidak konflik/hasil kosong). Tapi rating umur tetap membatasi.
            if (!genre || !forbiddenGenres.includes(genre)) {
                filterParams.without_genres = forbiddenGenres;
            }
        }
        // Jika showAdultContent = true, tidak pasang filter certification, 
        // jadi film R (Dewasa) akan muncul otomatis.

        const response = await axios.get(`${BASE_URL}/discover/movie`, tmdbParams(filterParams));
        res.status(200).json(response.data);

    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};

// 4. Search Movies
export const searchMovies = async (req, res, next) => {
    try {
        const { query, page, isAdult } = req.query;
        
        if (!query) {
            return next({ status: 400, message: 'Query pencarian diperlukan' });
        }

        const sanitizedQuery = query.replace(/[<>]/g, '');
        const currentPage = page || 1;
        const showAdultContent = isAdult === 'true'; //cek status isAdult

        // Langkah 1: Cari Film Berdasarkan JUDUL
        const moviesByTitlePromise = axios.get(`${BASE_URL}/search/movie`, tmdbParams({ 
            query: sanitizedQuery, 
            page: currentPage,
            include_adult: showAdultContent 
        }));

        // Langkah 2: Cari Orang
        const personSearchPromise = axios.get(`${BASE_URL}/search/person`, {
            params: {
                api_key: API_KEY,
                query: sanitizedQuery,
                include_adult: showAdultContent
            }
        });

        const [titleRes, personRes] = await Promise.all([moviesByTitlePromise, personSearchPromise]);

        let moviesByActor = [];
        let foundActorName = null;

        // Langkah 3: Filter Hasil Search Manual
        let moviesResults = titleRes.data.results;
        //filter manual 
        if (!showAdultContent) {
            moviesResults = moviesResults.filter(movie => {
                // Daftar ID Genre Terlarang untuk mode "SU":
                // 27: Horror (Hantu/Darah)
                // 80: Crime (Kriminal/Kekerasan)
                // 53: Thriller (Ketegangan/Psikopat/Vulgar)
                // 10749: Romance (Sering ada adegan seksual)
                const forbiddenGenres = [27, 80, 53, 10749, 14]; 
                // Cek apakah film punya SALAH SATU genre terlarang
                const hasForbiddenGenre = movie.genre_ids.some(id => forbiddenGenres.includes(id));

                // Kembalikan true jika TIDAK punya genre terlarang (film lolos filter)
                return !hasForbiddenGenre;
            });
        }

        if (personRes.data.results.length > 0) {
            const actor = personRes.data.results[0];
            foundActorName = actor.name;

            // Filter Certification untuk Discover (Aktor) juga harus ketat
            let actorFilterParams = {
                with_cast: actor.id,
                page: currentPage,
                sort_by: 'popularity.desc',
                include_adult: false
            };

            if (!showAdultContent) {
                actorFilterParams.certification_country = 'US';
                actorFilterParams['certification.lte'] = 'PG-13';
                 // Opsional: Tambahkan blokir genre juga di discover aktor biar konsisten
                actorFilterParams.without_genres = "27,80,53,10749"; 
            }

            const moviesByActorRes = await axios.get(`${BASE_URL}/discover/movie`, tmdbParams(actorFilterParams));
            moviesByActor = moviesByActorRes.data.results;
        }

        res.status(200).json({
            page: parseInt(currentPage),
            total_pages: titleRes.data.total_pages,
            resultsByTitle: moviesResults, // Hasil Judul
            resultsByActor: moviesByActor, // Hasil Aktor (sudah terfilter rating jika logic di atas dipakai)
            actorName: foundActorName 
        });

    } catch (error) {
        console.error("Search Error:", error);
        next({ status: error.response?.status || 500, message: 'Gagal mencari film' });
    }
};

// 5. Get Genres
export const getGenres = async (req, res, next) => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, tmdbParams());
        res.status(200).json(response.data.genres); 
    } catch (error) {
        next({ status: error.response?.status || 500, message: 'Gagal mengambil data dari TMDB' });
    }
};