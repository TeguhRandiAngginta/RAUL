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
import { StarFill, Trash, ArrowLeft, Calendar, Film, Bookmark } from "react-bootstrap-icons";
import '../styles/Watchlist.css';

const TMDB_API_KEY = "15050283b30a09e0018841fd5769b73b";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Watchlist() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        if (!user) {
            toast.error("Silakan login terlebih dahulu");
            navigate("/signin");
            return;
        }

        fetchWatchlist();
    }, [user, navigate]);

    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/watchlist/me');
            const movieIds = res.data;

            if (movieIds.length === 0) {
                setWatchlistMovies([]);
                setLoading(false);
                return;
            }

            const moviesWithDetails = await Promise.all(
                movieIds.map(async (movieId) => {
                    try {
                        const movieRes = await axios.get(
                            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=id-ID`
                        );
                        return movieRes.data;
                    } catch (error) {
                        console.error(`Gagal fetch movie ${movieId}:`, error);
                        return null;
                    }
                })
            );

            setWatchlistMovies(moviesWithDetails.filter(movie => movie !== null));
        } catch (error) {
            console.error("Gagal ambil watchlist:", error);
            toast.error("Gagal memuat watchlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (movieId, e) => {
        e.stopPropagation();
        
        if (!window.confirm("Hapus film dari watchlist?")) return;

        setRemovingId(movieId);
        try {
            await api.post('/users/watchlist/toggle', { tmdbMovieId: movieId });
            setWatchlistMovies(watchlistMovies.filter(movie => movie.id !== movieId));
            toast.success("Film dihapus dari watchlist");
        } catch (error) {
            console.error("Gagal hapus dari watchlist:", error);
            toast.error("Gagal menghapus dari watchlist");
        } finally {
            setRemovingId(null);
        }
    };

    const handleCardClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    const getRatingColor = (rating) => {
        if (rating >= 8) return "#10b981";
        if (rating >= 7) return "#ffc107";
        if (rating >= 5) return "#ff9800";
        return "#ef4444";
    };

    if (loading) {
        return (
            <div className="my-reviews-loading">
                <div className="text-center">
                    <Spinner animation="border" className="loading-spinner" />
                    <p className="mt-4 text-light fs-5 fw-light">Memuat watchlist...</p>
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
                                    Watchlist Saya
                                </h1>
                                <div className="d-flex align-items-center gap-3">
                                    <Badge bg="warning" text="dark" className="review-badge">
                                        <Bookmark className="me-2" size={16} />
                                        {watchlistMovies.length} Film
                                    </Badge>
                                    <p className="text-secondary mb-0 fw-light">
                                        Film yang ingin ditonton
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {watchlistMovies.length === 0 ? (
                    <div className="empty-state text-center py-5">
                        <div className="empty-icon">
                            <Bookmark size={60} color="#ffc107" />
                        </div>
                        <h3 className="text-light fw-bold mb-3">Watchlist Kosong</h3>
                        <p className="text-secondary mb-4 fs-5">
                            Tambahkan film yang ingin Anda tonton nanti!
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
                        {watchlistMovies.map((movie) => (
                            <Col xs={12} sm={6} lg={4} xl={3} key={movie.id}>
                                <Card 
                                    className="review-card h-100"
                                    onClick={() => handleCardClick(movie.id)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {/* Poster Section */}
                                    <div className="poster-container">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                movie.poster_path
                                                    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                                                    : "https://via.placeholder.com/500x750?text=No+Image"
                                            }
                                            alt={movie.title}
                                            className="poster-image"
                                        />
                                        
                                        <div className="poster-gradient" />
                                        
                                        {/* Rating Badge */}
                                        <div 
                                            className="rating-badge"
                                            style={{
                                                background: `linear-gradient(135deg, ${getRatingColor(movie.vote_average)}dd, ${getRatingColor(movie.vote_average)}ff)`
                                            }}
                                        >
                                            <StarFill size={18} color="#fff" className="me-2" />
                                            <span className="text-white fw-bold fs-6">
                                                {movie.vote_average?.toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Delete Button */}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="delete-button"
                                            onClick={(e) => handleRemove(movie.id, e)}
                                            disabled={removingId === movie.id}
                                        >
                                            {removingId === movie.id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                <Trash size={18} />
                                            )}
                                        </Button>
                                    </div>

                                    <Card.Body className="d-flex flex-column p-4">
                                        {/* Movie Title */}
                                        <h5 className="movie-title text-light fw-bold mb-3">
                                            {movie.title}
                                        </h5>

                                        {/* Release Year & Date */}
                                        <div className="review-date d-flex align-items-center mb-3 text-secondary">
                                            <Calendar size={14} className="me-2" />
                                            <span>
                                                {movie.release_date ? 
                                                    new Date(movie.release_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    }) : 'N/A'
                                                }
                                            </span>
                                        </div>
                                    </Card.Body>

                                    {/* Bottom Accent */}
                                    <div 
                                        className="bottom-accent"
                                        style={{
                                            background: `linear-gradient(90deg, ${getRatingColor(movie.vote_average)}, transparent)`
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