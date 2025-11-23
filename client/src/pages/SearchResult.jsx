// client/src/pages/SearchResult.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { searchMovies } from '../api/movieService';
import MovieCard from '../component/grid/MovieCard';
import { ArrowLeft, Search } from 'react-bootstrap-icons';
import '../styles/searchResult.css';

const SearchResult = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const query = searchParams.get('query');

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await searchMovies(query);
                setMovies(data.results || []);
                
                if (data.results.length === 0) {
                    setError(`Tidak ada hasil untuk pencarian "${query}"`);
                }
            } catch (error) {
                console.error("Gagal mencari film:", error);
                setError("Terjadi kesalahan saat mencari film");
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (isLoading) {
        return (
            <div className="search-loading-container">
                <div className="search-loading-content">
                    <Spinner animation="border" variant="warning" className="search-spinner" />
                    <p className="search-loading-text">Mencari film untuk "{query}"...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-result-page">
            {/* Decorative Background Pattern */}
            <div className="search-pattern"></div>
            
            {/* Decorative Elements */}
            <div className="search-decoration">
                <div className="search-deco-circle search-deco-1"></div>
                <div className="search-deco-circle search-deco-2"></div>
                <div className="search-deco-circle search-deco-3"></div>
            </div>

            <Container className="search-container">
                {/* Header Section */}
                <div className="search-header">
                    <button 
                        className="search-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                        <span>Kembali</span>
                    </button>
                    
                    <div className="search-title-wrapper">
                        <div className="search-icon-wrapper">
                            <Search size={32} />
                        </div>
                        <div className="search-title-content">
                            <h1 className="search-title">Hasil Pencarian</h1>
                            <p className="search-query">"{query}"</p>
                        </div>
                    </div>

                    {movies.length > 0 && (
                        <div className="search-info-badge">
                            <span className="search-count">{movies.length}</span>
                            <span className="search-label">film ditemukan</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                {error ? (
                    <div className="search-empty-state">
                        <div className="search-empty-icon">🎬</div>
                        <h3 className="search-empty-title">Tidak Ada Hasil</h3>
                        <p className="search-empty-text">{error}</p>
                        <button 
                            className="search-empty-btn"
                            onClick={() => navigate('/')}
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                ) : (
                    <div className="search-results-grid">
                        <Row>
                            {movies.map((movie) => (
                                <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xl={2.4} className="mb-4">
                                    <MovieCard movie={movie} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SearchResult;