import React from "react";

const FooterMini = ({ text }) => {
    return <div className="footer-mini">© {new Date().getFullYear()} CakeFactory {text && `· ${text}`}</div>;
};

export default FooterMini;