import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import "../../styles/movieGrid.css";

export default function MovieGrid() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=15050283b30a09e0018841fd5769b73b&language=id-ID&page=${page}`)
            .then((res) => res.json())
            .then((data) => setMovies(data.results))
            .catch((err) => console.error("Error fetching movies:", err))
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <Container fluid className="movie-grid-container py-4">
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="warning" />
                    <p className="text-muted mt-3">Memuat data film...</p>
                </div>
            ) : (
                <Row>
                    {movies.map((movie) => (
                        <Col key={movie.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Img
                                    variant="top"
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ height: "280px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title className="fs-6 text-truncate">{movie.title}</Card.Title>
                                    <div className="d-flex align-items-center">
                                        <StarFill color="#ffc107" className="me-1" />
                                        <span>{(movie.vote_average / 2).toFixed(1)}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <div className="text-center mt-3">
                <Button
                    onClick={() => setPage((prev) => prev + 1)}
                    style={{ backgroundColor: "#D9A299", border: "none" }}
                >
                    Halaman Berikutnya
                </Button>
            </div>
        </Container>
    );
}
