import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { StarFill, EyeFill, HeartFill, PlusCircle, ArrowLeft } from "react-bootstrap-icons";

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Scroll ke atas saat komponen dimuat
        window.scrollTo({ top: 0, behavior: "smooth" });

        const fetchMovieDetail = async () => {
            setLoading(true);
            try {
                // Coba ambil versi Indonesia dulu
                const resId = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=15050283b30a09e0018841fd5769b73b&language=id-ID&append_to_response=credits`
                );

                // Jika overview kosong, ambil versi Inggris sebagai fallback
                if (!resId.data.overview || resId.data.overview.trim() === "") {
                    const resEn = await axios.get(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=15050283b30a09e0018841fd5769b73b&language=en-US&append_to_response=credits`
                    );
                    // Gabungkan data: pakai bahasa Indonesia untuk yang ada, Inggris untuk overview
                    setMovie({
                        ...resId.data,
                        overview: resEn.data.overview,
                        tagline: resId.data.tagline || resEn.data.tagline
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (review.trim() === "") return;
        setReviews([...reviews, review]);
        setReview("");
    };

    if (loading) {
        return (
            <div className="text-center mt-5" style={{ minHeight: "100vh", backgroundColor: "#1a1a1a" }}>
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-light">Memuat detail film...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="text-center mt-5" style={{ minHeight: "100vh", backgroundColor: "#1a1a1a" }}>
                <h2 className="text-light">Film tidak ditemukan 😢</h2>
                <Button variant="warning" className="mt-3" onClick={() => navigate(-1)}>
                    <ArrowLeft className="me-2" />
                    Kembali
                </Button>
            </div>
        );
    }

    // Ambil director dari credits
    const director = movie.credits?.crew?.find(person => person.job === "Director")?.name || "Unknown";

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
                {/* Tombol Kembali */}
                {/* <Button
                    variant="outline-light"
                    className="mb-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="me-2" />
                    Kembali
                </Button> */}

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
                            <Button variant="outline-light">
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
                                const isHalf = i === Math.floor(ratingOutOf5) && ratingOutOf5 % 1 >= 0.5;

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
                            <span className="ms-2 text-secondary" style={{ fontSize: "0.9rem" }}>
                                (Rating TMDB: {movie.vote_average?.toFixed(1)}/10)
                            </span>
                        </div>
                    </Col>
                </Row>

                {/* Formulir masukkan review */}
                <Row className="mt-5">
                    <Col md={4}>
                        <h5 className="fw-bold text-light mb-3">Masukkan Review</h5>
                        <div className="bg-dark p-3 rounded">
                            <Form onSubmit={handleSubmit}>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Tulis pendapatmu tentang film ini..."
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    className="mb-3"
                                />
                                <Button
                                    type="submit"
                                    variant="warning"
                                    className="w-100 text-dark fw-bold"
                                >
                                    Kirim Review
                                </Button>
                            </Form>
                        </div>
                    </Col>

                    {/* Reviews */}
                    <Col md={8}>
                        <h5 className="fw-bold text-light mb-3">Reviews</h5>
                        {reviews.length === 0 ? (
                            <p className="text-white">Belum ada review. Jadilah yang pertama!</p>
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
                                    <p className="fw-bold text-warning mb-1">Kamu ★★★★☆</p>
                                    <p className="text-light mb-0">{rev}</p>
                                </div>
                            ))
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}