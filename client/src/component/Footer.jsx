import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
    return (
        <footer style={{
        backgroundColor: "#f5e6d3",
        padding: "10px 0",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%"
}}>

        <Container className="text-center">
            <span className="fw-bold">RAUL © 2025</span>
        </Container>
        </footer>
    );
};

export default Footer;
