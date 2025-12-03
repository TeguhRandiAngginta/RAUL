import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App.jsx";
import api from "../api/api";
import axios from "axios";
import toast from 'react-hot-toast';
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Button,
    Badge,
} from "react-bootstrap";
import { StarFill, Trash, ArrowLeft, Calendar, Film } from "react-bootstrap-icons";
import '../styles/MyReviews.css';

const TMDB_API_KEY = "15050283b30a09e0018841fd5769b73b";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MyReviews() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!user) {
            toast.error("Silakan login terlebih dahulu");
            navigate("/signin");
            return;
        }

        fetchMyReviews();
    }, [user, navigate]);

    const fetchMyReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reviews/my-reviews');
            
            const reviewsWithMovies = await Promise.all(
                res.data.map(async (review) => {
                    try {
                        const movieRes = await axios.get(
                            `https://api.themoviedb.org/3/movie/${review.tmdbMovieId}?api_key=${TMDB_API_KEY}&language=id-ID`
                        );
                        return {
                            ...review,
                            movie: movieRes.data
                        };
                    } catch (error) {
                        console.error(`Gagal fetch movie ${review.tmdbMovieId}:`, error);
                        return {
                            ...review,
                            movie: null
                        };
                    }
                })
            );

            setReviews(reviewsWithMovies);
        } catch (error) {
            console.error("Gagal ambil review:", error);
            toast.error("Gagal memuat review Anda");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId, e) => {
        e.stopPropagation();
        
        if (!window.confirm("Yakin ingin menghapus review ini?")) return;

        setDeletingId(reviewId);
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(rev => rev._id !== reviewId));
            toast.success("Review berhasil dihapus!");
        } catch (error) {
            console.error("Gagal hapus review:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus review");
        } finally {
            setDeletingId(null);
        }
    };

    const handleCardClick = (tmdbMovieId) => {
        console.log('Navigating to movie:', tmdbMovieId); // Debug log
        navigate(`/movie/${tmdbMovieId}`);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "#10b981";
        if (rating >= 3.5) return "#ffc107";
        if (rating >= 2.5) return "#ff9800";
        return "#ef4444";
    };

    if (loading) {
        return (
            <div className="my-reviews-loading">
                <div className="text-center">
                    <Spinner animation="border" className="loading-spinner" />
                    <p className="mt-4 text-light fs-5 fw-light">Memuat review Anda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-reviews-page">
            <div className="background-decoration" />

            <Container className="py-5 position-relative">
                {/* Header Section */}
                <Row className="mb-5">
                    <Col>
                        <Button 
                            variant="outline-light" 
                            onClick={() => navigate(-1)}
                            className="back-button mb-4"
                        >
                            <ArrowLeft className="me-2" size={20} />
                            Kembali
                        </Button>
                        
                        <div className="d-flex align-items-center mb-3">
                            <div className="accent-bar" />
                            <div>
                                <h1 className="page-title text-light fw-bold mb-2">
                                    Review Saya
                                </h1>
                                <div className="d-flex align-items-center gap-3">
                                    <Badge bg="warning" text="dark" className="review-badge">
                                        <Film className="me-2" size={16} />
                                        {reviews.length} Review
                                    </Badge>
                                    <p className="text-secondary mb-0 fw-light">
                                        Koleksi ulasan film Anda
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {reviews.length === 0 ? (
                    <div className="empty-state text-center py-5">
                        <div className="empty-icon">
                            <Film size={60} color="#ffc107" />
                        </div>
                        <h3 className="text-light fw-bold mb-3">Belum Ada Review</h3>
                        <p className="text-secondary mb-4 fs-5">
                            Mulai beri rating dan ulasan untuk film favorit Anda!
                        </p>
                        <Button 
                            variant="warning" 
                            onClick={() => navigate("/")}
                            className="explore-button px-5 py-3 fw-bold"
                        >
                            Jelajahi Film
                        </Button>
                    </div>
                ) : (
                    <Row className="g-3 justify-content-start">
                        {reviews.map((review) => (
                            <Col xs={12} sm={6} lg={4} xl={3} key={review._id}>
                                <Card 
                                    className="review-card h-100"
                                    onClick={() => handleCardClick(review.tmdbMovieId)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {/* Poster Section */}
                                    <div className="poster-container">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                review.movie?.poster_path
                                                    ? `${TMDB_IMAGE_BASE}${review.movie.poster_path}`
                                                    : "https://via.placeholder.com/500x750?text=No+Image"
                                            }
                                            alt={review.movie?.title || "Movie"}
                                            className="poster-image"
                                        />
                                        
                                        <div className="poster-gradient" />
                                        
                                        {/* Rating Badge */}
                                        <div 
                                            className="rating-badge"
                                            style={{
                                                background: `linear-gradient(135deg, ${getRatingColor(review.rating)}dd, ${getRatingColor(review.rating)}ff)`
                                            }}
                                        >
                                            <StarFill size={18} color="#fff" className="me-2" />
                                            <span className="text-white fw-bold fs-6">
                                                {review.rating.toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Delete Button */}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="delete-button"
                                            onClick={(e) => handleDelete(review._id, e)}
                                            disabled={deletingId === review._id}
                                        >
                                            {deletingId === review._id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                <Trash size={18} />
                                            )}
                                        </Button>
                                    </div>

                                    <Card.Body className="d-flex flex-column p-4">
                                        {/* Movie Title */}
                                        <h5 className="movie-title text-light fw-bold mb-3">
                                            {review.movie?.title || "Unknown Movie"}
                                        </h5>

                                        {/* Date */}
                                        <div className="review-date d-flex align-items-center mb-3 text-secondary">
                                            <Calendar size={14} className="me-2" />
                                            <span>
                                                {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {/* Review Comment */}
                                        <div className="comment-box">
                                            <Card.Text className="comment-text text-light mb-0">
                                                "{review.comment}"
                                            </Card.Text>
                                        </div>
                                    </Card.Body>

                                    {/* Bottom Accent */}
                                    <div 
                                        className="bottom-accent"
                                        style={{
                                            background: `linear-gradient(90deg, ${getRatingColor(review.rating)}, transparent)`
                                        }}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}