import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    watchlist: [], // <-- Ditambahkan: untuk menyimpan ID film di watchlist
    loading: false,  // <-- Ditambahkan: untuk status loading
    error: null,     // <-- Ditambahkan: untuk pesan error
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducer untuk menandai awal proses (misal: login)
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Reducer Anda yang sudah ada, dimodifikasi
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            // Asumsi action.payload adalah objek user lengkap dari database
            // yang juga berisi array 'watchlist'
            state.watchlist = action.payload.watchlist || [];
            state.error = null;
        },

        // Reducer untuk menandai kegagalan (misal: login gagal)
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; // Payload-nya adalah pesan error
        },

        // Reducer Anda yang sudah ada, dimodifikasi
        logout: (state) => {
            state.currentUser = null;
            state.watchlist = []; // Kosongkan watchlist saat logout
            state.loading = false;
            state.error = null;
        },

        // --- Reducer Baru untuk Watchlist ---

        /**
         * Untuk mengatur/mengganti seluruh array watchlist.
         * (Berguna jika Anda mengambil data watchlist secara terpisah)
         */
        setWatchlist: (state, action) => {
            state.watchlist = action.payload; // Payload-nya adalah array ID
        },

        /**
         * Untuk menambah/menghapus SATU movieId dari state watchlist.
         * Ini akan dipanggil di frontend (MovieDetail.jsx) SETELAH
         * panggilan API /watchlist/toggle berhasil, agar UI-nya sinkron.
         */
        toggleWatchlistState: (state, action) => {
            const movieId = action.payload; // Payload-nya adalah movie ID
            const index = state.watchlist.indexOf(movieId);

            if (index >= 0) {
                // Jika film sudah ada, hapus dari array
                state.watchlist.splice(index, 1);
            } else {
                // Jika film belum ada, tambahkan ke array
                state.watchlist.push(movieId);
            }
        },
        // ------------------------------------
    },
});

// Ekspor semua actions yang baru dan yang lama
export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setWatchlist,         // <-- Ekspor action baru
    toggleWatchlistState, // <-- Ekspor action baru
} = userSlice.actions;

export default userSlice.reducer;