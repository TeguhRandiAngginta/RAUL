import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useAuth } from '../../App';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import logoWeb from '../../assets/logo/logoWeb.png';
import '../../styles/navbar.css';

const Header = () => {
    const [input, setInput] = useState("");
    const [genres, setGenres] = useState([]);
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(30), (val, index) => currentYear - index);

    useEffect(() => {
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
            navigate(`/search?query=${input.trim()}`);
            setInput("");
        }
    };

    // Kelompokkan genre menjadi 3 kolom
    const genreColumns = [
        genres.slice(0, Math.ceil(genres.length / 3)),
        genres.slice(Math.ceil(genres.length / 3), Math.ceil(genres.length / 3) * 2),
        genres.slice(Math.ceil(genres.length / 3) * 2)
    ];

    // Kelompokkan tahun menjadi 3 kolom
    const yearColumns = [
        years.slice(0, 10),
        years.slice(10, 20),
        years.slice(20)
    ];

    return (
        <Navbar expand="lg" className="navbar navbar-fixed">
            <Container fluid>
                {/* Logo dan Brand */}
                <Navbar.Brand as={Link} to="/" className="navbar-brand">
                    <img src={logoWeb} alt="RAUL Logo" className="logo-icon" />
                    <span className="logo-brand">RAUL</span>
                </Navbar.Brand>

                {/* Dropdown Genre */}
                <div 
                    className="dropdown-container d-none d-lg-block"
                    onMouseEnter={() => setShowGenreDropdown(true)}
                    onMouseLeave={() => setShowGenreDropdown(false)}
                >
                    <button className="kategori-btn">
                        <span>☰</span> Genre
                        <span className={`dropdown-icon ${showGenreDropdown ? 'active' : ''}`}>▼</span>
                    </button>
                    
                    <div className={`mega-dropdown ${showGenreDropdown ? 'show' : ''}`}>
                        <div className="dropdown-grid">
                            {genreColumns.map((column, colIndex) => (
                                <div key={colIndex} className="dropdown-column">
                                    {column.map((genre) => (
                                        <Link
                                            key={genre.id}
                                            to={`/movies?genre=${genre.id}`}
                                            className="mega-dropdown-item"
                                            onClick={() => setShowGenreDropdown(false)}
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dropdown Tahun */}
                <div 
                    className="dropdown-container d-none d-lg-block"
                    onMouseEnter={() => setShowYearDropdown(true)}
                    onMouseLeave={() => setShowYearDropdown(false)}
                >
                    <button className="kategori-btn">
                        📅 Tahun
                        <span className={`dropdown-icon ${showYearDropdown ? 'active' : ''}`}>▼</span>
                    </button>
                    
                    <div className={`mega-dropdown mega-dropdown-year ${showYearDropdown ? 'show' : ''}`}>
                        <div className="dropdown-grid">
                            {yearColumns.map((column, colIndex) => (
                                <div key={colIndex} className="dropdown-column">
                                    {column.map((year) => (
                                        <Link
                                            key={year}
                                            to={`/movies?year=${year}`}
                                            className="mega-dropdown-item"
                                            onClick={() => setShowYearDropdown(false)}
                                        >
                                            {year}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Search Bar */}
                <Form onSubmit={handleSearch} className="seach-bar-container">
                    <InputGroup className="input-wrapper">
                        <InputGroup.Text className="bg-transparent border-0">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="search"
                            placeholder="Cari film, judul, atau penulis..."
                            className="inputsearch border-0 bg-transparent"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            aria-label="Search"
                        />
                    </InputGroup>
                </Form>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="auth-buttons-container">
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle 
                                    variant="link" 
                                    id="user-dropdown" 
                                    className="btn login-btn user-dropdown-btn text-decoration-none"
                                >
                                    {user.username}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="profile-dropdown-menu">
                                    <Dropdown.Item as={Link} to="/profile">Profil</Dropdown.Item> 
                                    <Dropdown.Item as={Link} to="/Watchlist">Watchlist</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/my-reviews">Review</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/signin" 
                                    state={{ from: location.pathname }} 
                                    className="btn login-btn btn-masuk"
                                >
                                    Masuk
                                </Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/signup" 
                                    className="btn login-btn btn-daftar"
                                >
                                    Daftar
                                </Nav.Link>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;