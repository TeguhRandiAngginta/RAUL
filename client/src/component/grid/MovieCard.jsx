// src/components/grid/MovieCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";
import '../../styles/movieCard.css'

export default function MovieCard({ movie }) {
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    return (
        <Card className="movie-card">
            <Card.Img variant="top" src={poster} alt={movie.title} />
            <Card.Body className="movie-card-body">
                <Card.Title className="movie-title">{movie.title}</Card.Title>
                <Card.Text className="movie-year">
                    {movie.release_date?.slice(0, 4)}
                </Card.Text>
                <div className="movie-rating">
                    <StarFill color="#ffc107" />{" "}
                    <span>{(movie.vote_average / 2).toFixed(1)}</span>
                </div>
                <Link to={`/movie/${movie.id}`}>
                    <Button className="movie-detail-btn">Detail</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}
