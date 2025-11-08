import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
    PlusCircle,
    ArrowLeft,
} from "react-bootstrap-icons";
import { FaStar } from "react-icons/fa";

// Komponen StarRating kustom untuk di dalam Modal
const StarRating = ({ rating, setRating, hover, setHover }) => {
    return (
        <div className="d-flex justify-content-center mb-3">
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index} style={{ cursor: "pointer" }}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: "none" }}
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

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    // State untuk Modal dan Review
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const fetchMovieDetail = async () => {
            setLoading(true);
            try {
                const resId = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=15050283b30a09e0018841fd5769b73b&language=id-ID&append_to_response=credits`
                );

                if (!resId.data.overview || resId.data.overview.trim() === "") {
                    const resEn = await axios.get(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=15050283b30a09e0018841fd5769b73b&language=en-US&append_to_response=credits`
                    );
                    setMovie({
                        ...resId.data,
                        overview: resEn.data.overview,
                        tagline: resId.data.tagline || resEn.data.tagline,
                    });
                } else {
                    setMovie(resId.data);
                }
            } catch (error) {
                console.error("Gagal ambil detail film:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);

    const handleShowModal = () => setShowReviewModal(true);
    const handleCloseModal = () => {
        setShowReviewModal(false);
        setUserRating(0);
        setUserReview("");
        setHoverRating(0);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (userRating === 0 || userReview.trim() === "") {
            alert("Harap isi rating bintang dan ulasan Anda.");
            return;
        }

        const newReview = {
            rating: userRating,
            text: userReview,
            user: "Kamu", // Nanti bisa diganti dengan user.username
        };

        setReviews([newReview, ...reviews]);
        handleCloseModal();
    };

    if (loading) {
        return (
            <div
                className="text-center mt-5"
                style={{ minHeight: "100vh", backgroundColor: "#1a1a1a" }}
            >
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-light">Memuat detail film...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div
                className="text-center mt-5"
                style={{ minHeight: "100vh", backgroundColor: "#1a1a1a" }}
            >
                <h2 className="text-light">Film tidak ditemukan 😢</h2>
                <Button variant="warning" className="mt-3" onClick={() => navigate(-1)}>
                    <ArrowLeft className="me-2" />
                    Kembali
                </Button>
            </div>
        );
    }

    const director =
        movie.credits?.crew?.find((person) => person.job === "Director")?.name ||
        "Unknown";

    return (
        <div
            style={{
                backgroundImage: movie.backdrop_path
                    ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                    : `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
                color: "#fff",
                position: "relative",
            }}
        >
            {/* Overlay gelap */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(8px)",
                }}
            ></div>

            {/* Konten utama */}
            <Container className="position-relative py-5" style={{ zIndex: 2 }}>
                <Row className="align-items-center">
                    {/* Poster */}
                    <Col md={4} className="text-center mb-4">
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/300x450?text=No+Image"
                            }
                            alt={movie.title}
                            className="rounded shadow-lg"
                            style={{
                                width: "100%",
                                maxWidth: "300px",
                                border: "2px solid #444",
                            }}
                        />
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <div className="text-center">
                                <EyeFill size={20} className="text-success" />{" "}
                                <small>{movie.popularity?.toFixed(0) || "0"}</small>
                            </div>
                            <div className="text-center">
                                <HeartFill size={18} className="text-danger" />{" "}
                                <small>{movie.vote_count || "0"}</small>
                            </div>
                            <div className="text-center">
                                <StarFill size={18} className="text-warning" />{" "}
                                <small>{movie.vote_average?.toFixed(1) || "0"}</small>
                            </div>
                        </div>
                    </Col>

                    {/* Detail kanan */}
                    <Col md={8}>
                        <h1 className="fw-bold">{movie.title}</h1>
                        <p className="text-secondary mb-1">
                            {movie.release_date?.slice(0, 4)} • Directed by{" "}
                            <span className="text-info">{director}</span>
                        </p>
                        {movie.tagline && (
                            <p className="text-uppercase fw-bold text-warning mb-3">
                                {movie.tagline}
                            </p>
                        )}

                        <p style={{ color: "#ccc", lineHeight: "1.8" }}>
                            {movie.overview || "Tidak ada deskripsi tersedia."}
                        </p>

                        {/* Genre badges */}
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="mb-3">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="badge bg-secondary me-2"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="d-flex gap-3 my-4 flex-wrap">
                            {movie.homepage && (
                                <Button
                                    variant="outline-light"
                                    href={movie.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <EyeFill /> Website
                                </Button>
                            )}
                            <Button variant="outline-light" onClick={handleShowModal}>
                                <StarFill /> Rate
                            </Button>
                            <Button variant="outline-light">
                                <PlusCircle /> Watchlist
                            </Button>
                        </div>

                        <div className="d-flex align-items-center">
                            <h5 className="me-2">Rating TMDB:</h5>
                            {[...Array(5)].map((_, i) => {
                                const ratingOutOf5 = movie.vote_average / 2;
                                const isFilled = i < Math.floor(ratingOutOf5);
                                const isHalf =
                                    i === Math.floor(ratingOutOf5) && ratingOutOf5 % 1 >= 0.5;

                                return (
                                    <StarFill
                                        key={i}
                                        color={isFilled || isHalf ? "#ffc107" : "#555"}
                                        className="me-1"
                                        style={{ opacity: isHalf ? 0.6 : 1 }}
                                    />
                                );
                            })}
                            <span className="ms-2 fw-bold">
                                {(movie.vote_average / 2).toFixed(1)}/5
                            </span>
                            <span
                                className="ms-2 text-secondary"
                                style={{ fontSize: "0.9rem" }}
                            >
                                (Rating TMDB: {movie.vote_average?.toFixed(1)}/10)
                            </span>
                        </div>
                    </Col>
                </Row>

                {/* --- Bagian Review --- */}
                <Row className="mt-5">
                    <Col md={12}>
                        <h5 className="fw-bold text-light mb-3">Ulasan Pengguna</h5>
                        {reviews.length === 0 ? (
                            <p className="text-white">Belum ada ulasan. Jadilah yang pertama!</p>
                        ) : (
                            reviews.map((rev, i) => (
                                <div
                                    key={i}
                                    className="p-3 mb-3 rounded"
                                    style={{
                                        backgroundColor: "#1b1b1b",
                                        border: "1px solid #2a2a2a",
                                    }}
                                >
                                    <p className="fw-bold text-warning mb-1">
                                        {rev.user}{" "}
                                        {[...Array(5)].map((_, index) => (
                                            <StarFill
                                                key={index}
                                                size={16}
                                                color={index < rev.rating ? "#ffc107" : "#555"}
                                                className={index > 0 ? "ms-1" : ""}
                                            />
                                        ))}
                                    </p>
                                    <p className="text-light mb-0">{rev.text}</p>
                                </div>
                            ))
                        )}
                    </Col>
                </Row>
            </Container>

            {/* --- Modal untuk Review --- */}
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
                                placeholder="Bagikan pendapat Anda tentang film ini..."
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                required
                                className="bg-dark text-light border-secondary rounded p-3"
                                style={{
                                    width: "90%",
                                    maxWidth: "500px",
                                    resize: "none",
                                    textAlign: "center",
                                }}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer className="bg-dark text-light border-secondary p-3">
                        <div className="d-flex justify-content-between w-100">
                            <Button
                                variant="outline-secondary"
                                onClick={handleCloseModal}
                                className="px-4 py-2 me-3"
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