import React from "react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

const FooterMini = ({ text }) => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer-mini">
            <div className="footer-mini-container">

                <div className="footer-mini-left">
                    © {year} <span className="brand">CakeFactory</span>
                    {text && <span className="footer-text"> · {text}</span>}
                </div>

                <div className="footer-socials">
                    <a href="#" target="_blank" rel="noreferrer">
                        <FaInstagram />
                    </a>

                    <a href="#" target="_blank" rel="noreferrer">
                        <FaFacebook />
                    </a>

                    <a href="#" target="_blank" rel="noreferrer">
                        <FaTiktok />
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default FooterMini;