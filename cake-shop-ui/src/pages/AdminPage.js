// src/pages/AdminPage.js
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import Navbar from "../components/Navbar";
import OrdersList from "../components/admin/tabs/OrdersList";
import ProductsList from "../components/admin/tabs/ProductsList";
import CustomersList from "../components/admin/tabs/CustomersList";
import PaymentsList from "../components/admin/tabs/PaymentsList";
import NotificationsList from "../components/admin/tabs/NotificationsList";

import {
    apiGet,
    apiSend,
    ORDERS_URL,
    PRODUCTS_URL,
    CUSTOMERS_URL,
    PAYMENTS_URL,
    NOTIFICATIONS_URL,
} from "../api/api";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("orders");

    const [cartCount, setCartCount] = useState(0);
    const [adminName, setAdminName] = useState("Admin");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    const [ordersFilterStatus, setOrdersFilterStatus] = useState("");
    const loadOrders = async (status = "") => {
        setOrdersLoading(true);
        setOrdersError("");
        try {
            const url = status
                ? `${ORDERS_URL}?status=${encodeURIComponent(status)}`
                : ORDERS_URL;

            const data = await apiGet(url);
            setOrders(Array.isArray(data) ? data : []);
            setOrdersFilterStatus(status);
        } catch (e) {
            setOrdersError(e?.message || "Не удалось загрузить заказы");
        } finally {
            setOrdersLoading(false);
        }
    };

    const changeOrderStatus = async (orderId, newStatus) => {
        if (!orderId || !newStatus) return;
        try {

            await apiSend(
                `${ORDERS_URL}/${encodeURIComponent(orderId)}/status?status=${encodeURIComponent(
                    newStatus
                )}`,
                {method: "PATCH"}
            );
            await loadOrders(ordersFilterStatus);
        } catch (e) {
            alert("Change status error: " + (e?.message || "Unknown error"));
        }
    };

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState("");

    const loadProducts = async () => {
        setProductsLoading(true);
        setProductsError("");
        try {
            const data = await apiGet(PRODUCTS_URL);
            setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
            setProductsError(e?.message || "Не удалось загрузить продукты");
        } finally {
            setProductsLoading(false);
        }
    };

    const createProduct = async (payload) => {
        try {
            await apiSend(PRODUCTS_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            await loadProducts();
        } catch (e) {
            alert("Create product error: " + (e?.message || "Unknown error"));
        }
    };

    const deleteProduct = async (id) => {
        if (!id) return;
        if (!window.confirm(`Удалить продукт #${id}?`)) return;

        try {
            await apiSend(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            await loadProducts();
        } catch (e) {
            alert("Delete product error: " + (e?.message || "Unknown error"));
        }
    };

    // -------- CUSTOMERS --------
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [customersError, setCustomersError] = useState("");

    const loadCustomers = async () => {
        setCustomersLoading(true);
        setCustomersError("");
        try {
            const data = await apiGet(CUSTOMERS_URL);
            setCustomers(Array.isArray(data) ? data : []);
        } catch (e) {
            setCustomersError(e?.message || "Не удалось загрузить клиентов");
        } finally {
            setCustomersLoading(false);
        }
    };

    const registerCustomer = async (payload) => {
        try {
            await apiSend(`${CUSTOMERS_URL}/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            await loadCustomers();
        } catch (e) {
            alert("Register error: " + (e?.message || "Unknown error"));
        }
    };

    // -------- PAYMENTS --------
    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState("");

    const loadPayments = async () => {
        setPaymentsLoading(true);
        setPaymentsError("");
        try {
            const data = await apiGet(PAYMENTS_URL);
            setPayments(Array.isArray(data) ? data : []);
        } catch (e) {
            setPaymentsError(e?.message || "Не удалось загрузить платежи");
        } finally {
            setPaymentsLoading(false);
        }
    };

    const createPayment = async (payload) => {
        try {
            await apiSend(PAYMENTS_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            await loadPayments();
        } catch (e) {
            alert("Create payment error: " + (e?.message || "Unknown error"));
        }
    };

    const confirmPayment = async (id) => {
        try {
            await apiSend(`${PAYMENTS_URL}/${encodeURIComponent(id)}/confirm`, {
                method: "POST",
            });
            await loadPayments();
        } catch (e) {
            alert("Confirm error: " + (e?.message || "Unknown error"));
        }
    };

    const refundPayment = async (id) => {
        try {
            await apiSend(`${PAYMENTS_URL}/${encodeURIComponent(id)}/refund`, {
                method: "POST",
            });
            await loadPayments();
        } catch (e) {
            alert("Refund error: " + (e?.message || "Unknown error"));
        }
    };

    // -------- NOTIFICATIONS --------
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationsError, setNotificationsError] = useState("");

    const loadNotifications = async () => {
        setNotificationsLoading(true);
        setNotificationsError("");
        try {
            const data = await apiGet(NOTIFICATIONS_URL);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (e) {
            setNotificationsError(e?.message || "Не удалось загрузить уведомления");
        } finally {
            setNotificationsLoading(false);
        }
    };

    // -------- COMMON --------
    const loadCartCount = () => {
        try {
            const raw = localStorage.getItem("cartItems");
            if (!raw) return setCartCount(0);
            const items = JSON.parse(raw);
            const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
            setCartCount(count);
        } catch {
            setCartCount(0);
        }
    };

    const loadAdminName = () => {
        try {
            const raw = localStorage.getItem("currentCustomer");
            if (!raw) return;
            const u = JSON.parse(raw);
            setAdminName(u?.name || "Admin");
        } catch {
            // ignore
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        switch (tab) {
            case "orders":
                loadOrders("");
                break;
            case "products":
                loadProducts();
                break;
            case "customers":
                loadCustomers();
                break;
            case "payments":
                loadPayments();
                break;
            case "notifications":
                loadNotifications();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        loadCartCount();
        loadAdminName();
        loadOrders("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const year = new Date().getFullYear();

    return (
        <div className="cart-page">
            <Navbar cartCount={cartCount}/>

            <div className="page">
                <header className="admin-header">
                    <div className="admin-logo">CAKEFACTORY · Admin</div>

                    <div className="admin-header-right">
            <span className="small">
              Logged in as <b>{adminName}</b>
            </span>
                        <Link to="/" className="btn-ghost">
                            Back to site
                        </Link>
                    </div>
                </header>

                {/* tabs */}
                <div className="admin-tabs">
                    {[
                        ["orders", "Orders"],
                        ["products", "Products"],
                        ["customers", "Customers"],
                        ["payments", "Payments"],
                        ["notifications", "Notifications"],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            className={"tab-btn" + (activeTab === key ? " active" : "")}
                            onClick={() => handleTabChange(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* content */}
                {activeTab === "orders" && (
                    <OrdersList
                        orders={orders}
                        loading={ordersLoading}
                        error={ordersError}
                        filterStatus={ordersFilterStatus}
                        onFilterChange={loadOrders}
                        onStatusChange={changeOrderStatus}
                    />
                )}

                {activeTab === "products" && (
                    <ProductsList
                        products={products}
                        loading={productsLoading}
                        error={productsError}
                        onCreate={createProduct}
                        onDelete={deleteProduct}
                    />
                )}

                {activeTab === "customers" && (
                    <CustomersList
                        customers={customers}
                        loading={customersLoading}
                        error={customersError}
                        onRegister={registerCustomer}
                    />
                )}

                {activeTab === "payments" && (
                    <PaymentsList
                        payments={payments}
                        loading={paymentsLoading}
                        error={paymentsError}
                        onCreate={createPayment}
                        onConfirm={confirmPayment}
                        onRefund={refundPayment}
                    />
                )}

                {activeTab === "notifications" && (
                    <NotificationsList
                        notifications={notifications}
                        loading={notificationsLoading}
                        error={notificationsError}
                    />
                )}

                <div className="footer-mini">© {year} CakeFactory · Admin</div>
            </div>
        </div>
    );
};

export default AdminPage;