// src/layout/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterMini from "../components/FooterMini";

const MainLayout = () => {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="page">
                <Outlet />
            </main>
            <FooterMini />
        </div>
    );
};

export default MainLayout;