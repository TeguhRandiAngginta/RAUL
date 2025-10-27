import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";

export default function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=15050283b30a09e0018841fd5769b73b&language=id-ID&page=${page}`
                );
                setMovies(res.data.results);
            } catch (error) {
                console.error("Gagal ambil data TMDB:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page]);

    const loadMore = () => {
        setPage((prev) => prev + 1);
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

                <div className="text-center mt-4">
                    <Button
                        onClick={loadMore}
                        variant="outline-dark"
                        style={{
                            backgroundColor: "#D9A299",
                            border: "none",
                            color: "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        Muat Lebih Banyak
                    </Button>
                </div>
            </Container>
        </div>
    );
}
