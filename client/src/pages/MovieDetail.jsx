import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleWatchlistState } from "../redux/userSlice";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../App.jsx";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Spinner,
    Modal,
} from "react-bootstrap";
import {
    StarFill,
    EyeFill,
    HeartFill,
    ArrowLeft,
    BookmarkPlus,
    BookmarkCheckFill,
} from "react-bootstrap-icons";
import { FaStar } from "react-icons/fa";
import "../styles/MovieDetail.css";

// ===== Komponen star rating di modal =====
const StarRating = ({ rating, setRating, hover, setHover }) => {
    return (
        <div className="d-flex justify-content-center mb-3">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index} className="star-label">
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            className="star-input"
                        />
                        <FaStar
                            size={40}
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            className="mx-1"
                        />
                    </label>
                );
            })}
        </div>
    );
};

// helper: cek apakah string “Latin” (ASCII basic)
const isAscii = (str = "") =>
    /^[\u0000-\u007F\s'".,-]+$/.test(str);

// pilih nama aktor versi alfabet Latin kalau tersedia
const getActorName = (actor = {}) => {
    const name = actor.name || "";
    const originalName = actor.original_name || "";

    if (isAscii(name) && name.trim() !== "") return name;
    if (isAscii(originalName) && originalName.trim() !== "") return originalName;
    return name || originalName || "Unknown";
};

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { watchlist } = useSelector((state) => state.user);

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const numericMovieId = Number(id);
    const isMovieInWatchlist = watchlist.includes(numericMovieId);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const fetchMovieData = async () => {
            setLoading(true);
            try {
                const movieRes = await api.get(`/movies/${id}`);
                setMovie(movieRes.data);

                const reviewsRes = await api.get(`/reviews/movie/${id}`);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error("Gagal ambil data film:", error);
                toast.error("Gagal memuat data film");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    const handleShowModal = () => {
        if (user) {
            setShowReviewModal(true);
        } else {
            toast.error("Silakan login terlebih dahulu", {
                duration: 2000,
                style: { background: "#333", color: "#fff" },
            });
            setTimeout(() => {
                navigate("/signin", { state: { from: location } });
            }, 1300);
        }
    };

    const handleCloseModal = () => {
        setShowReviewModal(false);
        setUserRating(0);
        setUserReview("");
        setHoverRating(0);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (userRating === 0) {
            toast.error("Harap isi rating bintang!", {
                duration: 3000,
                position: "top-center",
                style: { background: "#333", color: "#fff" },
            });
            return;
        }

        if (!userReview.trim()) {
            toast.error("Harap isi ulasan Anda!", {
                duration: 3000,
                position: "top-center",
                style: { background: "#333", color: "#fff" },
            });
            return;
        }

        const reviewData = {
            tmdbMovieId: id,
            rating: userRating,
            comment: userReview,
        };

        try {
            const res = await api.post("/reviews", reviewData);
            setReviews([res.data, ...reviews]);
            handleCloseModal();
            toast.success("Review berhasil dikirim! 🎉", {
                duration: 3000,
                position: "top-center",
                style: { background: "#333", color: "#fff" },
            });
        } catch (error) {
            console.error("Gagal mengirim review:", error);
            toast.error(
                error.response?.data?.message || "Gagal menyimpan review",
                {
                    duration: 4000,
                    position: "top-center",
                    style: { background: "#333", color: "#fff" },
                }
            );
        }
    };

    const handleToggleWatchlist = async () => {
        if (!user) {
            toast.error("Anda harus login untuk menambah watchlist", {
                duration: 2000,
                style: { background: "#333", color: "#fff" },
            });
            setTimeout(() => {
                navigate("/signin", { state: { from: location } });
            }, 1300);
            return;
        }

        setWatchlistLoading(true);
        const apiCall = api.post("/users/watchlist/toggle", {
            tmdbMovieId: numericMovieId,
        });

        toast.promise(
            apiCall,
            {
                loading: "Memperbarui watchlist...",
                success: (res) => {
                    dispatch(toggleWatchlistState(numericMovieId));
                    setWatchlistLoading(false);
                    return res.data.message;
                },
                error: (err) => {
                    setWatchlistLoading(false);
                    return (
                        err.response?.data?.message || "Gagal memperbarui watchlist"
                    );
                },
            },
            {
                style: { background: "#333", color: "#fff" },
            }
        );
    };

    if (loading) {
        return (
            <div className="text-center mt-5 movie-detail-state-container">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-light">Memuat detail film...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="text-center mt-5 movie-detail-state-container">
                <h2 className="text-light">Film tidak ditemukan 😢</h2>
                <Button
                    variant="warning"
                    className="mt-3"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="me-2" />
                    Kembali
                </Button>
            </div>
        );
    }

    // ====== INFO TAMBAHAN FILM ======
    const director =
        movie.credits?.crew?.find((p) => p.job === "Director")?.name || "N/A";

    const mainCast = movie.credits?.cast
        ? movie.credits.cast.slice(0, 3)
        : [];

    const runtimeText = movie.runtime ? `${movie.runtime} menit` : "N/A";
    const originalLanguage = movie.original_language?.toUpperCase() || "N/A";

    // rating umur mentah dari TMDB
    let rawAgeRating = "N/A";
    const releases = movie.release_dates?.results || [];
    if (releases.length > 0) {
        const found =
            releases.find((r) => r.iso_3166_1 === "ID") ||
            releases.find((r) => r.iso_3166_1 === "US") ||
            releases[0];

        const cert = found.release_dates?.find((d) => d.certification);
        if (cert?.certification) rawAgeRating = cert.certification;
    }

    // normalisasi rating umur → 18+ / 13+ / 10+ / SU
    const displayAgeRating = (() => {
        if (!rawAgeRating || rawAgeRating === "N/A") return "N/A";

        const digits = rawAgeRating.match(/\d+/);
        if (digits) {
            const num = parseInt(digits[0], 10);
            if (!Number.isNaN(num)) return `${num}+`;
        }

        const code = rawAgeRating.toUpperCase();

        if (["NC-17", "R", "D17", "TV-MA"].includes(code)) return "18+";
        if (["PG-13", "R13"].includes(code)) return "13+";
        if (["PG", "R7", "TV-PG"].includes(code)) return "10+";
        if (["G", "SU", "TV-Y", "TV-G"].includes(code)) return "SU";

        return rawAgeRating;
    })();

    const handleActorClick = (actor) => {
        const name = getActorName(actor);
        navigate(
            `/search?query=${encodeURIComponent(
                name
            )}&isAdult=${movie.adult ? "true" : "false"}`
        );
    };

    return (
        <div
            className="movie-detail-wrapper"
            style={{
                backgroundImage: movie.backdrop_path
                    ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                    : `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
            }}
        >
            <div className="movie-detail-overlay"></div>

            <Container className="py-5 movie-detail-content">
                <Row className="align-items-center">
                    <Col md={4} className="text-center mb-4">
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/300x450?text=No+Image"
                            }
                            alt={movie.title}
                            className="rounded shadow-lg movie-poster-img"
                        />
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <div>
                                <EyeFill size={20} className="text-success" />{" "}
                                <small>{movie.popularity?.toFixed(0) || "0"}</small>
                            </div>
                            <div>
                                <HeartFill size={18} className="text-danger" />{" "}
                                <small>{movie.vote_count || "0"}</small>
                            </div>
                            <div>
                                <StarFill size={18} className="text-warning" />{" "}
                                <small>{movie.vote_average?.toFixed(1) || "0"}</small>
                            </div>
                        </div>
                    </Col>

                    <Col md={8}>
                        <h1 className="fw-bold">{movie.title}</h1>
                        <p className="text-secondary mb-1">
                            {movie.release_date?.slice(0, 4)} • Directed by{" "}
                            <span className="text-info">{director}</span>
                        </p>

                        {/* META FILM – pakai flex + gap supaya tidak nabrak */}
                        <div className="d-flex flex-wrap gap-3 small text-secondary mb-2">
                            <span>
                                <strong>Durasi:</strong> {runtimeText}
                            </span>
                            <span>
                                <strong>Rating Umur:</strong> {displayAgeRating}
                            </span>
                            <span>
                                <strong>Bahasa Asli:</strong> {originalLanguage}
                            </span>
                        </div>

                        {/* Pemeran utama, nama sudah difilter ke alfabet Latin & bisa diklik */}
                        <p className="text-secondary mb-3">
                            <strong>Pemeran utama:</strong>{" "}
                            {mainCast.length === 0
                                ? "N/A"
                                : mainCast.map((actor, index) => {
                                    const displayName = getActorName(actor);
                                    return (
                                        <span
                                            key={actor.id || actor.name || index}
                                            className="actor-link"
                                            onClick={() => handleActorClick(actor)}
                                        >
                                            {displayName}
                                            {index < mainCast.length - 1 ? ", " : ""}
                                        </span>
                                    );
                                })}
                        </p>

                        {movie.tagline && (
                            <p className="text-uppercase fw-bold text-warning mb-3">
                                {movie.tagline}
                            </p>
                        )}

                        <p className="movie-overview">
                            {movie.overview || "Tidak ada deskripsi tersedia."}
                        </p>

                        {movie.genres && movie.genres.length > 0 && (
                            <div className="mb-3">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="badge bg-secondary me-2 genre-badge"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="d-flex gap-3 my-4 flex-wrap">
                            <Button variant="outline-light" onClick={handleShowModal}>
                                <StarFill /> Rate
                            </Button>
                            <Button
                                variant={isMovieInWatchlist ? "warning" : "outline-light"}
                                onClick={handleToggleWatchlist}
                                disabled={watchlistLoading}
                            >
                                {isMovieInWatchlist ? (
                                    <BookmarkCheckFill className="me-2" />
                                ) : (
                                    <BookmarkPlus className="me-2" />
                                )}
                                {watchlistLoading
                                    ? "Menyimpan..."
                                    : isMovieInWatchlist
                                        ? "Hapus Watchlist"
                                        : "Tambah Watchlist"}
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* REVIEW SECTION */}
                <Row className="mt-5">
                    <Col md={12}>
                        <h5 className="fw-bold text-light mb-3">Ulasan Pengguna</h5>
                        {reviews.length === 0 ? (
                            <p className="text-white">Belum ada ulasan. Jadilah yang pertama!</p>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev._id} className="p-3 mb-3 rounded review-card">
                                    <p className="fw-bold text-warning mb-1">
                                        {rev.user?.username || "User"}{" "}
                                        {[...Array(5)].map((_, index) => (
                                            <StarFill
                                                key={index}
                                                size={16}
                                                color={index < rev.rating ? "#ffc107" : "#555"}
                                                className={index > 0 ? "ms-1" : ""}
                                            />
                                        ))}
                                    </p>
                                    <p className="text-light mb-0">
                                        {rev.comment || rev.text}
                                    </p>
                                </div>
                            ))
                        )}
                    </Col>
                </Row>
            </Container>

            {/* MODAL REVIEW – versi “bawaan” yang lebih tebal & rapi */}
            <Modal
                show={showReviewModal}
                onHide={handleCloseModal}
                centered
                data-bs-theme="dark"
            >
                <Modal.Header
                    closeButton
                    className="bg-dark text-light border-secondary text-center"
                >
                    <Modal.Title as="h5" className="w-100 fw-bold">
                        Beri Ulasan Anda
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleReviewSubmit}>
                    <Modal.Body
                        className="bg-dark text-light d-flex flex-column align-items-center"
                    >
                        <p className="text-secondary mb-2">Pilih Rating Anda</p>
                        <StarRating
                            rating={userRating}
                            setRating={setUserRating}
                            hover={hoverRating}
                            setHover={setHoverRating}
                        />
                        <Form.Group className="mt-3 w-100 text-center d-flex flex-column align-items-center">
                            <Form.Label className="fw-semibold text-light mb-2">
                                Ulasan Anda
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Bagikan pendapat Anda..."
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                className="bg-dark text-light border-secondary rounded p-3 review-textarea"
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className="bg-dark text-light border-secondary px-4 py-3">
                        <div className="d-flex justify-content-between w-100 gap-3">
                            <Button
                                variant="outline-secondary"
                                onClick={handleCloseModal}
                                className="px-4 py-2"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="warning"
                                type="submit"
                                className="text-dark fw-bold px-4 py-2"
                            >
                                Kirim Ulasan
                            </Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
