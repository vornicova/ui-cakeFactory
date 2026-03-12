// src/App.js
import React from "react";
import {Routes, Route} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CakesPage from "./pages/CakesPage";
import CustomCakePage from "./pages/CustomCakePage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import AccountRoute from "./routes/AccountRoute";


const App = () => {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/menu" element={<MenuPage/>}/>
                <Route path="/cakes" element={<CakesPage/>}/>
                <Route path="/contacts" element={<ContactPage/>}/>
                <Route path="/account" element={<AccountRoute />} />                <Route path="/custom-cake" element={<CustomCakePage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/auth" element={<AuthPage />} />
            </Route>
        </Routes>
    );
};

export default App;