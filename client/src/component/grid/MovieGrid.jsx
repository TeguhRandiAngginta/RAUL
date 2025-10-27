import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/movieGrid.css";

export default function MovieGrid() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=id-ID&page=1`
                );
                const data = await res.json();
                if (data && data.results) {
                    setMovies(data.results);
                } else {
                    console.error("Invalid data format:", data);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [apiKey]);

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-2 text-muted">Memuat film...</p>
            </div>
        );
    }

    return (
        <div className="movie-slider-container">
            <h2 className="fw-bold mb-4" style={{ color: "#D9A299" }}>
                🎬 Film Populer Minggu Ini
            </h2>

            <Swiper
                modules={[EffectCoverflow, Navigation, Pagination]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                speed={1000}
                pagination={{ clickable: true }}
                navigation
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 120,
                    modifier: 1,
                    slideShadows: true,
                }}
                className="movie-grid-swiper"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id} className="movie-slide">
                        <Card className="movie-card h-100 shadow border-0">
                            <Card.Img
                                variant="top"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <Card.Body className="movie-info">
                                <Card.Title className="movie-title">{movie.title}</Card.Title>
                                <div className="d-flex align-items-center justify-content-center movie-rating">
                                    <StarFill color="#ffc107" className="me-1" />
                                    <span>{(movie.vote_average / 2).toFixed(1)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
