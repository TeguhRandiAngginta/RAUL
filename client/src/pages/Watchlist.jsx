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
} from "react-bootstrap";
import { Trash, ArrowLeft, Calendar } from "react-bootstrap-icons";
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
                        return {
                            ...movieRes.data,
                            addedAt: new Date() // Simulasi tanggal ditambahkan
                        };
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
        navigate(`/movies/${movieId}`);
    };

    if (loading) {
        return (
            <div className="watchlist-loading">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 text-light">Memuat watchlist...</p>
            </div>
        );
    }

    return (
        <div className="watchlist-page">
            <Container className="py-3">
                <Row className="mb-3">
                    <Col>
                        <Button 
                            variant="outline-light" 
                            onClick={() => navigate(-1)}
                            size="sm"
                            className="mb-2"
                        >
                            <ArrowLeft className="me-2" size={16} />
                            Kembali
                        </Button>
                        <h2 className="text-light fw-bold mb-1">Watchlist</h2>
                        <p className="text-secondary small mb-0">{watchlistMovies.length} film</p>
                    </Col>
                </Row>

                {watchlistMovies.length === 0 ? (
                    <div className="text-center py-4">
                        <h5 className="text-light mb-2">Watchlist kosong</h5>
                        <p className="text-secondary mb-3">Tambahkan film yang ingin ditonton</p>
                        <Button 
                            variant="warning" 
                            size="sm"
                            onClick={() => navigate("/")}
                        >
                            Jelajahi Film
                        </Button>
                    </div>
                ) : (
                    <Row className="g-2">
                        {watchlistMovies.map((movie) => (
                            <Col xs={6} sm={4} md={3} lg={2} key={movie.id}>
                                <Card 
                                    className="watchlist-card"
                                    onClick={() => handleCardClick(movie.id)}
                                >
                                    <div className="poster-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                movie.poster_path
                                                    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                                                    : "https://via.placeholder.com/300x450?text=No+Image"
                                            }
                                            alt={movie.title}
                                        />
                                        
                                        {/* Remove Button - Always Visible */}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="remove-btn"
                                            onClick={(e) => handleRemove(movie.id, e)}
                                            disabled={removingId === movie.id}
                                        >
                                            {removingId === movie.id ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                <Trash size={14} />
                                            )}
                                        </Button>
                                    </div>

                                    <Card.Body className="p-2">
                                        {/* Movie Title */}
                                        <h6 className="movie-title text-light mb-1">
                                            {movie.title}
                                        </h6>
                                        
                                        {/* Year */}
                                        <p className="movie-year text-secondary mb-0">
                                            {movie.release_date?.slice(0, 4) || "N/A"}
                                        </p>
                                        
                                        {/* Date Added */}
                                        <div className="date-added mt-1">
                                            <Calendar size={10} className="me-1" />
                                            <span>
                                                {movie.addedAt?.toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}