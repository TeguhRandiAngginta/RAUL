import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useAuth } from '../App';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../pages/style.css";

const Header = () => {
    const [input, setInput] = useState("");
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="px-3 navbar" style={{ backgroundColor: "#f5e6d3" }}>
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand href="/" className="fw-bold fs-3 logo-brand">
                    RAUL
                </Navbar.Brand>
                
                {/* Search Bar */}
                <div className="seach-bar-container">
                    <div className="input-wrapper">
                        <FaSearch id="search-icon" />
                        <input
                            placeholder="type to search..."
                            className="inputsearch"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Toggle for mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Navigation Links */}
                    <Nav className="ms-auto nav-links fw-bold">
                        <Nav.Link href="#genre">Genre</Nav.Link>
                        <Nav.Link href="#populer">Populer</Nav.Link>
                        <Nav.Link href="#negara">Negara</Nav.Link>
                        <Nav.Link href="#tahun">Tahun</Nav.Link>
                    </Nav>

                    {/* Login or Username */}
                    <div className="d-flex align-items-center ms-auto">
                        {user ? (
                            <Nav.Link 
                                as={Link} 
                                to="/" 
                                className="btn btn-info login-btn"
                                onClick={handleLogout}
                            >
                                {user.username}
                            </Nav.Link>
                        ) : (
                            <Nav.Link 
                                as={Link} 
                                to="/signin" 
                                state={{ from: location.pathname }} 
                                className="btn btn-info login-btn"
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