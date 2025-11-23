// client/src/component/grid/MovieCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";
import '../../styles/movieCard.css';

export default function MovieCard({ movie }) {
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    return (
        <Card className="movie-card h-100 shadow border-0">
            <Card.Img 
                variant="top" 
                src={poster} 
                alt={movie.title}
                className="movie-card-img"
            />
            <Card.Body className="movie-card-body d-flex flex-column">
                <Card.Title className="movie-card-title text-truncate fw-bold mb-2">
                    {movie.title}
                </Card.Title>
                <Card.Text className="mb-2">
                    <small className="text-muted">
                        {movie.release_date?.slice(0, 4) || 'N/A'}
                    </small>
                </Card.Text>
                <div className="movie-rating d-flex align-items-center mb-3">
                    <StarFill color="#ffc107" className="me-1" />
                    <span className="fw-bold me-2">
                        {movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A'}
                    </span>
                    <small className="text-muted">
                        ({movie.vote_count || 0})
                    </small>
                </div>
                <Link to={`/movie/${movie.id}`} className="mt-auto">
                    <Button className="movie-detail-btn w-100 fw-bold">
                        Detail Film
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
}