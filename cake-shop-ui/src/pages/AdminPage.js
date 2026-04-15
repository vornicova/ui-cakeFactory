import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OrdersList from "../components/admin/tabs/OrdersList";
import ProductsList from "../components/admin/tabs/ProductsList";
import CakeDesignsList from "../components/admin/tabs/CakeDesignsList";
import CategoriesList from "../components/admin/tabs/CategoriesList";
import CustomersList from "../components/admin/tabs/CustomersList";
import PaymentsList from "../components/admin/tabs/PaymentsList";
import NotificationsList from "../components/admin/tabs/NotificationsList";

import {
    apiGet,
    apiSend,
    ORDERS_URL,
    PRODUCTS_URL,
    CAKE_DESIGNS_URL,
    CATEGORIES_URL,
    USERS_URL,
    PAYMENTS_URL,
    NOTIFICATIONS_URL,
    ADMIN_PRODUCTS_URL,
} from "../api/api";

import "../styles/admin.css";

const IMAGE_BASE = "http://localhost:8081";

const AdminPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("orders");
    const [adminName, setAdminName] = useState("ADMIN");

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    const [ordersFilterStatus, setOrdersFilterStatus] = useState("");

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState("");

    const [cakeDesigns, setCakeDesigns] = useState([]);
    const [cakeDesignsLoading, setCakeDesignsLoading] = useState(false);
    const [cakeDesignsError, setCakeDesignsError] = useState("");

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState("");

    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [customersError, setCustomersError] = useState("");

    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState("");

    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationsError, setNotificationsError] = useState("");

    const resolveImageUrl = (rawUrl) => {
        if (!rawUrl) return "";
        const url = String(rawUrl).trim();

        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;

        return `${IMAGE_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const normalizeProduct = (product) => ({
        ...product,
        imageUrl: resolveImageUrl(product?.imageUrl),
    });

    const normalizeCakeDesign = (design) => ({
        ...design,
        imageUrl: resolveImageUrl(design?.imageUrl),
    });

    const loadAdminName = () => {
        try {
            const raw = localStorage.getItem("currentUserProfile");
            if (!raw) {
                setAdminName("ADMIN");
                return;
            }

            const user = JSON.parse(raw);
            setAdminName(user?.fullName || user?.name || user?.username || user?.email || "ADMIN");
        } catch {
            setAdminName("ADMIN");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("authTokens");
        localStorage.removeItem("currentUserProfile");
        sessionStorage.clear();

        setAdminName("ADMIN");
        navigate("/auth", { replace: true });
    };

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
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const changeOrderStatus = async (orderId, newStatus) => {
        try {
            await apiSend(
                `${ORDERS_URL}/${encodeURIComponent(orderId)}/status?status=${encodeURIComponent(newStatus)}`,
                { method: "PATCH" }
            );
            await loadOrders(ordersFilterStatus);
        } catch (e) {
            alert("Ошибка изменения статуса: " + (e?.message || "Unknown error"));
        }
    };

    const loadProducts = async () => {
        setProductsLoading(true);
        setProductsError("");

        try {
            const data = await apiGet(PRODUCTS_URL);
            const safeData = Array.isArray(data) ? data : [];
            setProducts(safeData.map(normalizeProduct));
        } catch (e) {
            setProductsError(e?.message || "Не удалось загрузить продукты");
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    const buildProductFormData = (payload) => {
        const formData = new FormData();

        formData.append("name", payload?.name ?? "");
        formData.append("description", payload?.description ?? "");
        formData.append("price", payload?.price ?? "");
        formData.append("isActive", String(payload?.isActive ?? true));
        formData.append("categoryCode", payload?.categoryCode ?? "");

        if (payload?.imageFile instanceof File) {
            formData.append("image", payload.imageFile);
        }

        return formData;
    };

    const createProduct = async (payload) => {
        try {
            const formData = buildProductFormData(payload);

            await apiSend(ADMIN_PRODUCTS_URL, {
                method: "POST",
                body: formData,
            });

            await loadProducts();
        } catch (e) {
            alert("Ошибка создания продукта: " + (e?.message || "Unknown error"));
        }
    };

    const updateProduct = async (id, payload) => {
        try {
            const formData = buildProductFormData(payload);

            await apiSend(`${ADMIN_PRODUCTS_URL}/${encodeURIComponent(id)}`, {
                method: "PUT",
                body: formData,
            });

            await loadProducts();
        } catch (e) {
            alert("Ошибка обновления продукта: " + (e?.message || "Unknown error"));
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm(`Удалить продукт #${id}?`)) return;

        try {
            await apiSend(`${ADMIN_PRODUCTS_URL}/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            await loadProducts();
        } catch (e) {
            alert("Ошибка удаления продукта: " + (e?.message || "Unknown error"));
        }
    };

    const loadCakeDesigns = async () => {
        setCakeDesignsLoading(true);
        setCakeDesignsError("");

        try {
            const data = await apiGet(CAKE_DESIGNS_URL);
            const safeData = Array.isArray(data) ? data : [];
            setCakeDesigns(safeData.map(normalizeCakeDesign));
        } catch (e) {
            setCakeDesignsError(e?.message || "Не удалось загрузить дизайны тортов");
            setCakeDesigns([]);
        } finally {
            setCakeDesignsLoading(false);
        }
    };

    const buildCakeDesignFormData = (payload) => {
        const formData = new FormData();

        formData.append("name", payload?.name ?? "");
        formData.append("description", payload?.description ?? "");
        formData.append("designCategory", payload?.designCategory ?? "");
        formData.append("isActive", String(payload?.isActive ?? true));
        formData.append("decorPrice", payload?.decorPrice ?? "");

        if (payload?.imageFile instanceof File) {
            formData.append("image", payload.imageFile);
        }

        return formData;
    };

    const createCakeDesign = async (payload) => {
        try {
            const formData = buildCakeDesignFormData(payload);

            await apiSend(CAKE_DESIGNS_URL, {
                method: "POST",
                body: formData,
            });

            await loadCakeDesigns();
        } catch (e) {
            alert("Ошибка создания дизайна: " + (e?.message || "Unknown error"));
        }
    };

    const updateCakeDesign = async (id, payload) => {
        try {
            const formData = buildCakeDesignFormData(payload);

            await apiSend(`${CAKE_DESIGNS_URL}/${encodeURIComponent(id)}`, {
                method: "PUT",
                body: formData,
            });

            await loadCakeDesigns();
        } catch (e) {
            alert("Ошибка обновления дизайна: " + (e?.message || "Unknown error"));
        }
    };

    const deleteCakeDesign = async (id) => {
        if (!window.confirm(`Удалить дизайн #${id}?`)) return;

        try {
            await apiSend(`${CAKE_DESIGNS_URL}/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });

            await loadCakeDesigns();
        } catch (e) {
            alert("Ошибка удаления дизайна: " + (e?.message || "Unknown error"));
        }
    };

    const loadCategories = async () => {
        setCategoriesLoading(true);
        setCategoriesError("");

        try {
            const data = await apiGet(CATEGORIES_URL);
            setCategories(Array.isArray(data) ? data : []);
        } catch (e) {
            setCategoriesError(e?.message || "Не удалось загрузить категории");
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const createCategory = async (payload) => {
        try {
            await apiSend(CATEGORIES_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            await loadCategories();
        } catch (e) {
            alert("Ошибка создания категории: " + (e?.message || "Unknown error"));
        }
    };

    const updateCategory = async (id, payload) => {
        try {
            await apiSend(`${CATEGORIES_URL}/${encodeURIComponent(id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            await loadCategories();
        } catch (e) {
            alert("Ошибка обновления категории: " + (e?.message || "Unknown error"));
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm(`Удалить категорию #${id}?`)) return;

        try {
            await apiSend(`${CATEGORIES_URL}/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });

            await loadCategories();
        } catch (e) {
            alert("Ошибка удаления категории: " + (e?.message || "Unknown error"));
        }
    };

    const loadCustomers = async () => {
        setCustomersLoading(true);
        setCustomersError("");

        try {
            const data = await apiGet(USERS_URL);
            setCustomers(Array.isArray(data) ? data : []);
        } catch (e) {
            setCustomersError(e?.message || "Не удалось загрузить клиентов");
            setCustomers([]);
        } finally {
            setCustomersLoading(false);
        }
    };

    const loadPayments = async () => {
        setPaymentsLoading(true);
        setPaymentsError("");

        try {
            const data = await apiGet(PAYMENTS_URL);
            setPayments(Array.isArray(data) ? data : []);
        } catch (e) {
            setPaymentsError(e?.message || "Не удалось загрузить платежи");
            setPayments([]);
        } finally {
            setPaymentsLoading(false);
        }
    };

    const loadNotifications = async () => {
        setNotificationsLoading(true);
        setNotificationsError("");

        try {
            const data = await apiGet(NOTIFICATIONS_URL);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (e) {
            setNotificationsError(e?.message || "Не удалось загрузить уведомления");
            setNotifications([]);
        } finally {
            setNotificationsLoading(false);
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
                loadCategories();
                break;
            case "cake-designs":
                loadCakeDesigns();
                break;
            case "categories":
                loadCategories();
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
        try {
            const rawTokens = localStorage.getItem("authTokens");
            const rawUser = localStorage.getItem("currentUserProfile");

            if (!rawTokens || !rawUser) {
                navigate("/auth", { replace: true });
                return;
            }

            const tokens = JSON.parse(rawTokens);
            const user = JSON.parse(rawUser);

            const token = tokens?.accessToken;

            if (!token) {
                navigate("/auth", { replace: true });
                return;
            }

            if (user?.role !== "ADMIN") {
                navigate("/", { replace: true });
                return;
            }

            loadAdminName();
            loadOrders("");
        } catch {
            navigate("/auth", { replace: true });
        }
    }, [navigate]);

    const year = new Date().getFullYear();

    const tabs = [
        ["orders", "Orders"],
        ["products", "Products"],
        ["cake-designs", "Cake Designs"],
        ["categories", "Categories"],
        ["customers", "Customers"],
        ["payments", "Payments"],
        ["notifications", "Notifications"],
    ];

    return (
        <div className="admin-page-shell">
            <div className="admin-page">
                <header className="admin-header">
                    <div className="admin-logo">CAKEFACTORY · Admin</div>

                    <div className="admin-header-right">
                        <span className="admin-user">
                            Logged in as <b>{adminName}</b>
                        </span>

                        <Link to="/" className="admin-btn admin-btn-light">
                            Back to site
                        </Link>

                        <button
                            type="button"
                            className="admin-btn admin-btn-light"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="admin-tabs">
                    {tabs.map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            className={`admin-tab ${activeTab === key ? "active" : ""}`}
                            onClick={() => handleTabChange(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <section className="admin-content-card">
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
                            categories={categories}
                            loading={productsLoading || categoriesLoading}
                            error={productsError || categoriesError}
                            onCreate={createProduct}
                            onUpdate={updateProduct}
                            onDelete={deleteProduct}
                        />
                    )}

                    {activeTab === "cake-designs" && (
                        <CakeDesignsList
                            cakeDesigns={cakeDesigns}
                            loading={cakeDesignsLoading}
                            error={cakeDesignsError}
                            onCreate={createCakeDesign}
                            onUpdate={updateCakeDesign}
                            onDelete={deleteCakeDesign}
                        />
                    )}

                    {activeTab === "categories" && (
                        <CategoriesList
                            categories={categories}
                            loading={categoriesLoading}
                            error={categoriesError}
                            onCreate={createCategory}
                            onUpdate={updateCategory}
                            onDelete={deleteCategory}
                        />
                    )}

                    {activeTab === "customers" && (
                        <CustomersList
                            customers={customers}
                            loading={customersLoading}
                            error={customersError}
                        />
                    )}

                    {activeTab === "payments" && (
                        <PaymentsList
                            payments={payments}
                            loading={paymentsLoading}
                            error={paymentsError}
                        />
                    )}

                    {activeTab === "notifications" && (
                        <NotificationsList
                            notifications={notifications}
                            loading={notificationsLoading}
                            error={notificationsError}
                        />
                    )}
                </section>

                <div className="admin-footer">© {year} CakeFactory · Admin</div>
            </div>
        </div>
    );
};

export default AdminPage;