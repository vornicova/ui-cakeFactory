// src/components/Navbar.jsx
import React, { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const getIsAdmin = () => {
    try {
        const raw = localStorage.getItem("currentCustomer");
        if (!raw) return false;
        const u = JSON.parse(raw);
        return (u?.role || "").toString().toUpperCase() === "ADMIN";
    } catch {
        return false;
    }
};

const Navbar = () => {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const isAdmin = useMemo(getIsAdmin, []);

    return (
        <nav className="navbar">
            <div className="navbar-logo">CAKEFACTORY</div>

            <div className="navbar-menu">
                <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                    Home
                </NavLink>
                <NavLink to="/menu" className={({ isActive }) => (isActive ? "active" : "")}>
                    Menu
                </NavLink>
                <NavLink to="/cakes" className={({ isActive }) => (isActive ? "active" : "")}>
                    Designs
                </NavLink>
                <NavLink to="/contacts" className={({ isActive }) => (isActive ? "active" : "")}>
                    Contacts
                </NavLink>
                <NavLink to="/custom-cake" className={({ isActive }) => (isActive ? "active" : "")}>
                    Custom cake
                </NavLink>
                <NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>
                    Account
                </NavLink>
            </div>

            <div className="navbar-cart">
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>
          Cart ({cartCount})
        </span>

                {isAdmin && (
                    <>
                        &nbsp;·&nbsp; Admin · <Link to="/admin">open</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;