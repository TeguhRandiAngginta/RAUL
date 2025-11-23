import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../api/api'; // Gunakan api.js langsung
import MovieCard from '../component/grid/MovieCard';
import { ArrowLeft, Search, PersonVideo } from 'react-bootstrap-icons';
import '../styles/searchResult.css';

const SearchResult = () => {
    const [searchData, setSearchData] = useState({ resultsByTitle: [], resultsByActor: [], actorName: null });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const query = searchParams.get('query');
    const isAdult = searchParams.get('isAdult'); // Ambil status 18+

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Panggil endpoint search di backend
                const res = await api.get('/movies/search', {
                    params: { query, isAdult }
                });
                
                const data = res.data;
                setSearchData({
                    resultsByTitle: data.resultsByTitle || [],
                    resultsByActor: data.resultsByActor || [],
                    actorName: data.actorName
                });
                
                if ((!data.resultsByTitle || data.resultsByTitle.length === 0) && 
                    (!data.resultsByActor || data.resultsByActor.length === 0)) {
                    setError(`Tidak ada hasil untuk pencarian "${query}"`);
                }

            } catch (error) {
                console.error("Gagal mencari film:", error);
                setError("Terjadi kesalahan saat mencari film");
                setSearchData({ resultsByTitle: [], resultsByActor: [], actorName: null });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, isAdult]); // Re-fetch jika query atau isAdult berubah

    if (isLoading) {
        return (
            <div className="search-loading-container">
                <div className="search-loading-content">
                    <Spinner animation="border" variant="warning" className="search-spinner" />
                    <p className="search-loading-text">Mencari film "{query}"...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-result-page">
            <div className="search-pattern"></div>
            
            <Container className="search-container position-relative z-2">
                <div className="search-header mb-5">
                    <button className="search-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> <span>Kembali</span>
                    </button>
                    
                    <div className="search-title-wrapper mt-4">
                        <div className="search-icon-wrapper">
                            <Search size={32} />
                        </div>
                        <div className="search-title-content">
                            <h1 className="search-title">Hasil Pencarian</h1>
                            <p className="search-query">"{query}" {isAdult === 'true' && <span className="badge bg-danger ms-2">18+</span>}</p>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="search-empty-state text-center">
                        <div className="search-empty-icon fs-1 mb-3">🎬</div>
                        <h3 className="search-empty-title text-light">Tidak Ada Hasil</h3>
                        <p className="search-empty-text text-muted">{error}</p>
                        <button className="btn btn-outline-warning mt-3" onClick={() => navigate('/')}>
                            Kembali ke Beranda
                        </button>
                    </div>
                ) : (
                    <div className="search-results-content">
                        {/* BAGIAN 1: HASIL BERDASARKAN JUDUL */}
                        {searchData.resultsByTitle.length > 0 && (
                            <section className="mb-5">
                                <h4 className="text-warning mb-4 border-bottom border-secondary pb-2">
                                    Berdasarkan Judul Film
                                </h4>
                                <Row className="g-4">
                                    {searchData.resultsByTitle.map((movie) => (
                                        <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                                            <MovieCard movie={movie} />
                                        </Col>
                                    ))}
                                </Row>
                            </section>
                        )}

                        {/* BAGIAN 2: HASIL BERDASARKAN AKTOR */}
                        {searchData.resultsByActor.length > 0 && (
                            <section>
                                <h4 className="text-info mb-4 border-bottom border-secondary pb-2 d-flex align-items-center">
                                    <PersonVideo className="me-2" />
                                    Film yang dibintangi: {searchData.actorName}
                                </h4>
                                <Row className="g-4">
                                    {searchData.resultsByActor.map((movie) => (
                                        <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                                            <MovieCard movie={movie} />
                                        </Col>
                                    ))}
                                </Row>
                            </section>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SearchResult;