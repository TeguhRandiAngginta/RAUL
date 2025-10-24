import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { movies } from "../utils/movies.js";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { StarFill, EyeFill, HeartFill, PlusCircle } from "react-bootstrap-icons";

export default function MovieDetail() {
    const { id } = useParams();
    const movie = movies.find((m) => m.id === id);
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);

    if (!movie) {
        return <h2 className="text-center mt-5 text-light">Film tidak ditemukan 😢</h2>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (review.trim() === "") return;
        setReviews([...reviews, review]);
        setReview("");
    };

    return (
        <div
            style={{
                backgroundImage: `url(${movie.backdrop || movie.img})`,
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
                            src={movie.poster || movie.img}
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
                                <EyeFill size={20} className="text-success" /> <small>145K</small>
                            </div>
                            <div className="text-center">
                                <HeartFill size={18} className="text-danger" /> <small>33K</small>
                            </div>
                            <div className="text-center">
                                <PlusCircle size={18} className="text-info" /> <small>34K</small>
                            </div>
                        </div>
                    </Col>

                    {/* Detail kanan */}
                    <Col md={8}>
                        <h1 className="fw-bold">{movie.title}</h1>
                        <p className="text-secondary mb-1">
                            {movie.year} • Directed by{" "}
                            <a href="#" className="text-info">
                                {movie.director || "Unknown"}
                            </a>
                        </p>
                        <p className="text-uppercase fw-bold text-warning mb-3">
                            {movie.tagline || "No going back."}
                        </p>

                        <p style={{ color: "#ccc", lineHeight: "1.8" }}>{movie.desc}</p>

                        <div className="d-flex gap-3 my-4 flex-wrap">
                            <Button variant="outline-light">
                                <EyeFill /> Watch
                            </Button>
                            <Button variant="outline-light">
                                <StarFill /> Rate
                            </Button>
                            <Button variant="outline-light">
                                <PlusCircle /> Watchlist
                            </Button>
                        </div>

                        <div className="d-flex align-items-center">
                            <h5 className="me-2">Rate:</h5>
                            {[...Array(5)].map((_, i) => (
                                <StarFill key={i} color="#ffc107" className="me-1" />
                            ))}
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
