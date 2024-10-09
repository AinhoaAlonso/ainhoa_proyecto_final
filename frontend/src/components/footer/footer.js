// Footer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter, faSquareFacebook, faSquareInstagram } from '@fortawesome/free-brands-svg-icons';
import image_logo from '../../static/assets/image_logo.jpg';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <img src={image_logo} alt="Logo" className="footer-logo-img" />
                </div>
                <div className="footer-social-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faSquareFacebook} className="social-icon" />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faSquareXTwitter} className="social-icon" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faSquareInstagram} className="social-icon" />
                    </a>
                </div>
                <div className="footer-links">
                    <NavLink to={'/politicadeprivacidad'} className="footer-link">
                        Política de Privacidad
                    </NavLink>
                    <span className="footer-separator">|</span>
                    <NavLink to={'/terminosycondiciones'} className="footer-link">
                        Términos y Condiciones
                    </NavLink>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
