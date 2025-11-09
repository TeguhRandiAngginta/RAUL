// client/src/pages/SearchResult.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../api/api';
import MovieGrid from '../component/grid/MovieGrid';

const SearchResult = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    
    const query = searchParams.get('query'); // Ambil kata kunci dari URL

    useEffect(() => {
        if (!query) return; // Jangan lakukan apa-apa jika tidak ada query

        const fetchSearchResults = async () => {
            setIsLoading(true);
            try {
                // Panggil endpoint /movies/search yang sudah dibuat
                const res = await api.get('/movies/search', {
                    params: { query }
                });
                setMovies(res.data.results);
            } catch (error) {
                console.error("Gagal mencari film:", error);
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <h2 className="mb-4">Hasil Pencarian untuk: "{query}"</h2>
                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <MovieGrid movies={movies} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SearchResult;