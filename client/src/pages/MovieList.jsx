import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { StarFill, ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";

export default function MovieList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Ambil halaman dari URL, default ke 1 jika tidak ada
    const page = parseInt(searchParams.get("page")) || 1;

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=15050283b30a09e0018841fd5769b73b&language=id-ID&page=${page}`
                );
                setMovies(res.data.results);
                setTotalPages(res.data.total_pages);
            } catch (error) {
                console.error("Gagal ambil data TMDB:", error);
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };

        fetchMovies();
    }, [page]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString() });
    };

    if (loading) {
        return (
            <div className="text-center mt-5 text-secondary">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3">Memuat daftar film...</p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#FAF7F3", minHeight: "100vh", padding: "50px 0" }}>
            <Container>
                <h1 className="fw-bold mb-4" style={{ color: "#D9A299" }}>
                    Semua Film Populer 🎞️
                </h1>

                <Row>
                    {movies.map((movie) => (
                        <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card
                                className="h-100 shadow border-0"
                                style={{ backgroundColor: "#F0E4D3", color: "#1a1a1a" }}
                            >
                                <Card.Img
                                    variant="top"
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : "https://via.placeholder.com/500x750?text=No+Image"
                                    }
                                    style={{ height: "350px", objectFit: "cover" }}
                                    alt={movie.title}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-truncate fw-bold mb-1">{movie.title}</Card.Title>
                                    <Card.Text className="mb-2">
                                        <small className="text-muted">{movie.release_date?.slice(0, 4)}</small>
                                    </Card.Text>
                                    <div className="d-flex align-items-center mb-3">
                                        <StarFill color="#ffc107" className="me-1" />
                                        <span className="fw-bold me-2">{(movie.vote_average / 2).toFixed(1)}</span>
                                        <small className="text-muted">({movie.vote_count})</small>
                                    </div>

                                    <Link to={`/movie/${movie.id}`} className="mt-auto">
                                        <Button
                                            variant="dark"
                                            className="w-100 fw-bold"
                                            style={{ backgroundColor: "#D9A299", border: "none" }}
                                        >
                                            Detail Film
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Navigasi Panah */}
                <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                    {/* Panah kiri */}
                    <Button
                        variant="light"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        style={{
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            backgroundColor: page === 1 ? "#ddd" : "#D9A299",
                            border: "none",
                        }}
                    >
                        <ArrowLeftCircle size={28} color="#fff" />
                    </Button>

                    <span className="fw-bold" style={{ color: "#D9A299" }}>
                        Halaman {page} / {totalPages > 500 ? 500 : totalPages}
                    </span>

                    {/* Panah kanan */}
                    <Button
                        variant="light"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || page >= 500}
                        style={{
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            backgroundColor:
                                page === totalPages || page >= 500 ? "#ddd" : "#D9A299",
                            border: "none",
                        }}
                    >
                        <ArrowRightCircle size={28} color="#fff" />
                    </Button>
                </div>
            </Container>
        </div>
    );
}