import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { StarFill } from 'react-bootstrap-icons';
import { dummyMovies } from '../utils/dummyMovies'; // <-- IMPORT DATA DUMMY

// --- Komponen Kartu Film (MovieCard) ---
const MovieCard = ({ movie }) => {
    // URL dasar gambar sudah disematkan di data dummy
    const posterUrl = movie.poster_path;
    const rating = (movie.vote_average / 2).toFixed(1); // Konversi ke skala 5

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100 shadow border-0" style={{ backgroundColor: '#F0E4D3', color: '#1a1a1a' }}>
                <Card.Img 
                    variant="top" 
                    src={posterUrl} 
                    style={{ height: '350px', objectFit: 'cover' }} 
                    alt={movie.title}
                />
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate fw-bold mb-1">{movie.title}</Card.Title>
                    <Card.Text className="mb-2">
                        <small className="text-muted">{movie.release_date.split('-')[0]}</small>
                    </Card.Text>
                    <div className="d-flex align-items-center mb-3">
                        <StarFill color="#ffc107" className="me-1" />
                        <span className="fw-bold me-2">{rating}</span>
                        <small className="text-muted">({movie.vote_count})</small>
                    </div>
                    
                    <Link 
                        to={`/movie/${movie.id}`} 
                        className="mt-auto"
                    >
                        <Button variant="dark" className="w-100 fw-bold" style={{ backgroundColor: '#D9A299', border: 'none' }}>
                            Lihat Detail
                        </Button>
                    </Link>
                </Card.Body>
            </Card>
        </Col>
    );
};

// --- Komponen Home Utama ---
export default function Home() {
    
    // Style Container sesuai skema warna Anda
    const containerStyle = {
        backgroundColor: '#FAF7F3', 
        minHeight: '100vh',
        paddingTop: '30px',
        paddingBottom: '30px',
    };

    return (
        <Container fluid style={containerStyle}>
            <h1 className="mb-4 fw-bold" style={{ color: '#D9A299' }}>Rekomendasi Film Populer</h1>
            <Row>
                {/* Langsung mapping data dummy */}
                {dummyMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} /> 
                ))}
            </Row>
        </Container>
    );
}