import React from "react";
import { useParams } from "react-router-dom";
import { movies } from "../utils/movies";
import { Container, Row, Col, Button } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";

export default function MovieDetail() {
    const { id } = useParams();
    const movie = movies.find((m) => m.id === id);

    if (!movie) {
        return <h2 className="text-center mt-5">Film tidak ditemukan 😢</h2>;
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <div
                        className="text-white rounded"
                        style={{
                            backgroundImage: `url(${movie.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            padding: "150px 40px",
                            position: "relative",
                        }}
                    >
                        <h1>{movie.title}</h1>
                        <div
                            className="position-absolute top-0 end-0 mt-3 me-3 d-flex align-items-center"
                            style={{
                                backgroundColor: "rgba(0,0,0,0.4)",
                                borderRadius: "8px",
                                padding: "5px 10px",
                            }}
                        >
                            <StarFill color="#ffc107" className="me-1" />
                            <span className="fw-bold">{movie.rating} / 10</span>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={8}>
                    <p>{movie.desc}</p>
                </Col>
                <Col md={4}>
                    <Button variant="outline-dark" className="w-100">
                        Beri Rating
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
