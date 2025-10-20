import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import "../pages/style.css";

const Header = () => {
    const [input, setInput] = useState("");
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

                    {/* Login and Profile Icon */}
                    <div className="d-flex align-items-center ms-auto">
                        <Nav.Link href="/signin" className="btn btn-info login-btn">
                            LOGIN
                        </Nav.Link>
                        <FaUserCircle size={30} className="ms-2 profile-icon" />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;