import React from "react";
import '../../styles/Footer.css';

const Footer = () => {
    return (
        <footer id="custom-footer" className="custom-footer">
            <div className="footer-col footer-brand">
                <h3 className="footer-brand-title">RAUL</h3>
                <p>Made with <span className="heart">❤</span> by Team RAUL</p>
                <div className="social-icons">
                    <a href="#"><img src="https://assets.codepen.io/9051928/codepen_1.png" alt="CodePen" /></a>
                    <a href="#"><img src="https://assets.codepen.io/9051928/x.png" alt="Twitter" /></a>
                    <a href="#"><img src="https://assets.codepen.io/9051928/youtube_1.png" alt="YouTube" /></a>
                </div>
                <p className="copyright">2025 © All Rights Reserved</p>
            </div>

            <div className="footer-col footer-links">
                <p>About</p>
                <p>Our mission</p>
                <p>Privacy Policy</p>
                <p>Terms of service</p>
            </div>

            <div className="footer-col footer-links">
                <p>Services</p>
                <p>Products</p>
                <p>Join our team</p>
                <p>Partner with us</p>
            </div>
        </footer>
    );
};

export default Footer;