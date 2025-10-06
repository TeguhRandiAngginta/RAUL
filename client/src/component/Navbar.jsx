import React from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const Header = () => {
    return (
        <Navbar expand="lg" style={{ backgroundColor: "#f5e6d3" }} className="px-3">
        <Container fluid>
            {/* Logo */}
            <Navbar.Brand href="/" className="fw-bold fs-3">
            RAUL
            </Navbar.Brand>

            {/* Search Bar */}
            <Form className="d-flex mx-3" style={{ maxWidth: "1000px", maxHeight: "90px" }}>
            <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
            />
            {/* button search */}
            <Button variant="outline-dark" style={{maxWidth: "50px", padding: "10px" }}>
                <FaSearch />
            </Button>
            </Form>

            {/* Navigation */}
            <Nav className="me-auto fw-bold">
            <Nav.Link href="#genre">Genre</Nav.Link>
            <Nav.Link href="#populer">Populer</Nav.Link>
            <Nav.Link href="#negara">Negara</Nav.Link>
            <Nav.Link href="#tahun">Tahun</Nav.Link>
            </Nav>

            {/* Login / Register */}
            <div className="d-flex align-items-center">
                <Nav.Link href="signin">LOGIN</Nav.Link>
                <span>/</span>
                <Nav.Link href="signup">REGISTER</Nav.Link>
            <FaUserCircle size={30} />
            </div>
        </Container>
        </Navbar>
    );
};

export default Header;
