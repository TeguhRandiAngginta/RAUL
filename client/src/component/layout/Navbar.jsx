import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useAuth } from '../../App';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import '../../styles/navbar.css';

const Header = () => {
    const [input, setInput] = useState("");
    const [genres, setGenres] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Buat array tahun dari tahun sekarang mundur 30 tahun
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(30), (val, index) => currentYear - index);

    useEffect(() => {
        // Ambil daftar genre saat komponen dimuat
        const fetchGenres = async () => {
            try {
                const response = await api.get('/movies/genres');
                setGenres(response.data);
            } catch (error) {
                console.error("Gagal mengambil genre:", error);
            }
        };
        fetchGenres();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim()) {
            navigate(`/movies?search=${input.trim()}`); // Sesuaikan path rute pencarian Anda
             // Atau jika menggunakan endpoint discover untuk search: navigate(`/discover?query=${input.trim()}`);
             // Tapi biasanya search punya halaman sendiri atau pakai page movies dengan query param.
             // Asumsi saya Anda akan pakai MovieList.jsx untuk menampilkan hasil search juga.
        }
    };

    return (
        <Navbar expand="lg" className="px-3 navbar" style={{ backgroundColor: "#f5e6d3" }}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 logo-brand">
                    RAUL
                </Navbar.Brand>
                
                {/* Search Bar dengan Form agar bisa di-Enter */}
                <Form onSubmit={handleSearch} className="seach-bar-container">
                    <div className="input-wrapper d-flex align-items-center">
                        <FaSearch id="search-icon" className="me-2" />
                        <input
                            placeholder="type to search..."
                            className="inputsearch border-0 bg-transparent"
                            style={{ outline: 'none', width: '100%' }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </Form>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto nav-links fw-bold align-items-center">
                        {/* Dropdown Genre */}
                        <Dropdown>
                            <Dropdown.Toggle variant="link" className="nav-link text-dark fw-bold text-decoration-none border-0">
                                Genre
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {genres.map((genre) => (
                                    <Dropdown.Item key={genre.id} as={Link} to={`/movies?genre=${genre.id}`}>
                                        {genre.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Dropdown Tahun */}
                        <Dropdown>
                            <Dropdown.Toggle variant="link" className="nav-link text-dark fw-bold text-decoration-none border-0">
                                Tahun
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {years.map((year) => (
                                    <Dropdown.Item key={year} as={Link} to={`/movies?year=${year}`}>
                                        {year}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>

                    <div className="d-flex align-items-center ms-3">
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle 
                                    variant="link" 
                                    id="user-dropdown" 
                                    className="btn btn-info login-btn p-2 text-decoration-none text-dark fw-bold border-0"
                                >
                                    {user.username}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="profile-dropdown-menu">
                                    {/* Ganti /account dengan /profile jika rute Anda profile */}
                                    <Dropdown.Item as={Link} to="/profile">Profil</Dropdown.Item> 
                                    {/* Watchlist mungkin bisa digabung di halaman profil */}
                                    <Dropdown.Item as={Link} to="/profile">Watchlist</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Nav.Link 
                                as={Link} 
                                to="/signin" 
                                state={{ from: location.pathname }} 
                                className="btn btn-info login-btn px-3 py-2 text-dark fw-bold"
                                style={{ borderRadius: '20px' }} // Contoh styling tambahan
                            >
                                LOGIN
                            </Nav.Link>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;