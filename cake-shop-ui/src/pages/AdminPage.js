// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "/api";

// можно подправить под реальные микросервисы
const ORDERS_URL = API_BASE + "/orders";
const PRODUCTS_URL = API_BASE + "/products"; // catalog-service
const CUSTOMERS_URL = API_BASE + "/users";
const PAYMENTS_URL = API_BASE + "/payments";
const NOTIFICATIONS_URL = API_BASE + "/notifications";

const AdminPage = () => {
    const navigate = useNavigate();

    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [adminName, setAdminName] = useState("Admin");

    const [activeTab, setActiveTab] = useState("orders");

    // ORDERS
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    const [ordersFilterStatus, setOrdersFilterStatus] = useState("");
    const [statusOrderId, setStatusOrderId] = useState("");
    const [statusNewStatus, setStatusNewStatus] = useState("NEW");

    // PRODUCTS
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState("");
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        active: true,
    });

    // CUSTOMERS
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [customersError, setCustomersError] = useState("");
    const [customerForm, setCustomerForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // PAYMENTS
    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState("");
    const [paymentForm, setPaymentForm] = useState({
        orderId: "",
        amount: "",
        currency: "MDL",
        method: "CARD",
    });

    // NOTIFICATIONS
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationsError, setNotificationsError] = useState("");

    // --- helpers ---

    const apiGet = async (url) => {
        const res = await fetch(url);
        const text = await res.text();
        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }

        if (!res.ok) {
            const msg =
                (data && (data.message || data.error)) ||
                text ||
                `Error ${res.status}`;
            throw new Error(msg);
        }

        return data;
    };

    const apiSend = async (url, options) => {
        const res = await fetch(url, options);
        const text = await res.text();
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }
        if (!res.ok) {
            const msg =
                (data && data.message) || text || `Error ${res.status}`;
            throw new Error(msg);
        }
        return data;
    };

    const statusClass = (status) => {
        if (!status) return "status-pill";
        const key = status.toString().toLowerCase();
        if (key === "new") return "status-pill status-new";
        if (key === "in_progress") return "status-pill status-in_progress";
        if (key === "ready") return "status-pill status-ready";
        if (key === "done") return "status-pill status-done";
        if (key === "cancelled") return "status-pill status-cancelled";
        return "status-pill";
    };

    const shortDate = (iso) => {
        if (!iso) return "";
        return iso.toString().replace("T", " ").substring(0, 16);
    };

    // --- auth / cart on mount ---

    useEffect(() => {
        // cart
        try {
            const raw = localStorage.getItem("cartItems");
            if (raw) {
                const items = JSON.parse(raw);
                const count = items.reduce(
                    (sum, it) => sum + (it.quantity || 0),
                    0
                );
                setCartItemsCount(count);
            }
        } catch (e) {
            console.error("cartItems read error", e);
            setCartItemsCount(0);
        }

        // currentCustomer — ТОЛЬКО читаем, БЕЗ navigate
        try {
            const raw = localStorage.getItem("currentCustomer");
            if (raw) {
                const usr = JSON.parse(raw);
                const role = usr.role ? usr.role.toString().toUpperCase() : "";
                console.log("AdminPage user:", usr, "role:", role);
                setAdminName(usr.name || "Admin");
            } else {
                console.log("AdminPage: no currentCustomer in localStorage");
            }
        } catch (e) {
            console.error("currentCustomer parse error", e);
        }

        // стартовый таб
        loadOrders("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- LOADERS ---

    const loadOrders = async (statusFilter = ordersFilterStatus) => {
        setOrdersLoading(true);
        setOrdersError("");
        try {
            let url = ORDERS_URL;
            if (statusFilter) {
                url += `?status=${encodeURIComponent(statusFilter)}`;
            }
            const data = await apiGet(url);
            setOrders(Array.isArray(data) ? data : []);
            setOrdersFilterStatus(statusFilter);
        } catch (e) {
            console.error(e);
            setOrdersError(e.message || "Не удалось загрузить заказы");
        } finally {
            setOrdersLoading(false);
        }
    };

    const loadProducts = async () => {
        setProductsLoading(true);
        setProductsError("");
        try {
            const data = await apiGet(PRODUCTS_URL);
            setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setProductsError(
                e.message || "Не удалось загрузить продукты"
            );
        } finally {
            setProductsLoading(false);
        }
    };

    const loadCustomers = async () => {
        setCustomersLoading(true);
        setCustomersError("");
        try {
            const data = await apiGet(CUSTOMERS_URL);
            setCustomers(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setCustomersError(
                e.message || "Не удалось загрузить клиентов"
            );
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
            console.error(e);
            setPaymentsError(
                e.message || "Не удалось загрузить платежи"
            );
        } finally {
            setPaymentsLoading(false);
        }
    };

    const loadNotifications = async () => {
        setNotificationsLoading(true);
        setNotificationsError("");

        try {
            // базовый URL
            let url = NOTIFICATIONS_URL;

            // пробуем достать текущего пользователя из localStorage
            try {
                const raw = localStorage.getItem("currentCustomer");
                if (raw) {
                    const usr = JSON.parse(raw);
                    if (usr.id) {
                        // добавляем ?customerId=... если есть id
                        url += `?customerId=${encodeURIComponent(usr.id)}`;
                    }
                }
            } catch (e) {
                console.error("currentCustomer parse error in notifications", e);
            }

            const data = await apiGet(url);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setNotificationsError(
                e.message || "Не удалось загрузить уведомления"
            );
        } finally {
            setNotificationsLoading(false);
        }
    };


    // --- ORDERS actions ---

    const handleOrdersFilterClick = (status) => {
        loadOrders(status);
    };

    const prefillStatus = (id, status) => {
        setStatusOrderId(id?.toString() || "");
        setStatusNewStatus(status || "NEW");
    };

    const changeStatusManual = async () => {
        if (!statusOrderId) return;
        try {
            await apiSend(
                `${ORDERS_URL}/${statusOrderId}/status?status=${encodeURIComponent(
                    statusNewStatus
                )}`,
                { method: "PATCH" }
            );
            await loadOrders(ordersFilterStatus);
        } catch (e) {
            alert("Status change error: " + e.message);
        }
    };

    // --- PRODUCTS actions ---

    const handleProductFormChange = (field, value) => {
        setProductForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        if (!productForm.name || !productForm.price) {
            alert("Name и price обязательны");
            return;
        }

        const payload = {
            name: productForm.name,
            description: productForm.description || "",

            price: Number(productForm.price),

            categoryCode: productForm.category || null,
            imageUrl: productForm.imageUrl || null,
            active: !!productForm.active,
        };

        try {
            await apiSend(PRODUCTS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setProductForm({
                name: "",
                description: "",
                price: "",
                category: "",
                imageUrl: "",
                active: true,
            });
            await loadProducts();
        } catch (e) {
            alert("Create product error: " + e.message);
        }
    };


    // --- CUSTOMERS actions ---

    const handleCustomerFormChange = (field, value) => {
        setCustomerForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCustomerSubmit = async (e) => {
        e.preventDefault();
        if (!customerForm.email || !customerForm.password) {
            alert("Email и password обязательны");
            return;
        }
        const payload = {
            name: customerForm.name,
            email: customerForm.email,
            phone: customerForm.phone,
            password: customerForm.password,
        };
        try {
            await apiSend(`${CUSTOMERS_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setCustomerForm({
                name: "",
                email: "",
                phone: "",
                password: "",
            });
            await loadCustomers();
        } catch (e) {
            alert("Register error: " + e.message);
        }
    };

    // --- PAYMENTS actions ---

    const handlePaymentFormChange = (field, value) => {
        setPaymentForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!paymentForm.orderId || !paymentForm.amount) {
            alert("OrderId и amount обязательны");
            return;
        }
        const payload = {
            orderId: Number(paymentForm.orderId),
            amount: Number(paymentForm.amount),
            currency: paymentForm.currency || "MDL",
            method: paymentForm.method || "CARD",
        };
        try {
            await apiSend(PAYMENTS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setPaymentForm({
                orderId: "",
                amount: "",
                currency: "MDL",
                method: "CARD",
            });
            await loadPayments();
        } catch (e) {
            alert("Create payment error: " + e.message);
        }
    };

    const confirmPayment = async (id) => {
        try {
            await apiSend(`${PAYMENTS_URL}/${id}/confirm`, {
                method: "POST",
            });
            await loadPayments();
        } catch (e) {
            alert("Confirm error: " + e.message);
        }
    };

    const refundPayment = async (id) => {
        try {
            await apiSend(`${PAYMENTS_URL}/${id}/refund`, {
                method: "POST",
            });
            await loadPayments();
        } catch (e) {
            alert("Refund error: " + e.message);
        }
    };

    // --- NOTIFICATIONS: только просмотр ---

    const year = new Date().getFullYear();

    // переключение табов
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

    return (
        <div className="cart-page">
            <div style={{ padding: "16px", color: "red" }}>
                ADMIN PAGE DEBUG: component rendered
            </div>

            {/* Общий navbar, как на остальных страницах */}
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/cakes">Cakes</Link>
                    <Link to="/desserts">Pastries</Link>
                    <Link to="/contacts">Contact</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/custom-cake">Custom cake</Link>
                </div>
                <div className="navbar-cart">
                    <Link to="/cart">
                        Cart ({cartItemsCount})
                    </Link>
                    &nbsp;·&nbsp; Admin ·{" "}
                    <Link to="/admin" className="active">
                        open
                    </Link>
                </div>
            </nav>

            <div className="page">
                {/* header */}
                <header className="admin-header">
                    <div className="admin-logo">
                        CAKEFACTORY · Admin
                    </div>
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
                            className={
                                "tab-btn" +
                                (activeTab === key ? " active" : "")
                            }
                            onClick={() => handleTabChange(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <section className="admin-section">
                        <div className="admin-cards-grid">
                            <div className="card">
                                <div className="card-title">
                                    <h2>Orders</h2>
                                    <span>
                                        {orders.length} orders
                                    </span>
                                </div>

                                <div className="pill-filter mb-8">
                                    {[
                                        ["", "All"],
                                        ["NEW", "New"],
                                        ["IN_PROGRESS", "In progress"],
                                        ["READY", "Ready"],
                                        ["DONE", "Done"],
                                        ["CANCELLED", "Cancelled"],
                                    ].map(([value, label]) => (
                                        <button
                                            key={value || "all"}
                                            type="button"
                                            className={
                                                value ===
                                                ordersFilterStatus
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleOrdersFilterClick(
                                                    value
                                                )
                                            }
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {ordersError && (
                                    <div className="status-msg err">
                                        <strong>
                                            Не удалось загрузить заказы
                                        </strong>
                                        <div className="small">
                                            {ordersError}
                                        </div>
                                    </div>
                                )}

                                {ordersLoading && (
                                    <div className="status-msg">
                                        Загружаем заказы...
                                    </div>
                                )}

                                {!ordersLoading && !ordersError && (
                                    <table className="admin-table">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Customer</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Pickup</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map((o) => (
                                            <tr key={o.id}>
                                                <td>{o.id}</td>
                                                <td>
                                                    {o.customerName ||
                                                        "-"}
                                                    <br />
                                                    <span className="small">
                                                            {o.customerPhone ||
                                                                ""}
                                                        </span>
                                                </td>
                                                <td>
                                                    {o.totalPrice ??
                                                        o.totalAmount ??
                                                        ""}
                                                </td>
                                                <td>
                                                        <span
                                                            className={statusClass(
                                                                o.status
                                                            )}
                                                        >
                                                            {o.status}
                                                        </span>
                                                </td>
                                                <td>
                                                        <span className="small">
                                                            {shortDate(
                                                                o.pickupTime
                                                            )}
                                                        </span>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn-sm btn-outline"
                                                        onClick={() =>
                                                            prefillStatus(
                                                                o.id,
                                                                o.status
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!orders.length && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="small"
                                                >
                                                    Нет заказов.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="card">
                                <div className="card-title">
                                    <h2>Change status</h2>
                                    <span>Fast update</span>
                                </div>
                                <div className="form-grid">
                                    <div>
                                        <label htmlFor="statusOrderId">
                                            Order ID
                                        </label>
                                        <input
                                            id="statusOrderId"
                                            className="input"
                                            type="number"
                                            min="1"
                                            value={statusOrderId}
                                            onChange={(e) =>
                                                setStatusOrderId(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="statusSelect">
                                            New status
                                        </label>
                                        <select
                                            id="statusSelect"
                                            className="select"
                                            value={statusNewStatus}
                                            onChange={(e) =>
                                                setStatusNewStatus(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="NEW">
                                                NEW
                                            </option>
                                            <option value="IN_PROGRESS">
                                                IN_PROGRESS
                                            </option>
                                            <option value="READY">
                                                READY
                                            </option>
                                            <option value="DONE">
                                                DONE
                                            </option>
                                            <option value="CANCELLED">
                                                CANCELLED
                                            </option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-primary mt-8"
                                        onClick={changeStatusManual}
                                    >
                                        Update
                                    </button>
                                    <div className="small mt-8">
                                        Выберите заказ справа или
                                        укажите ID вручную.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* PRODUCTS */}
                {activeTab === "products" && (
                    <section className="admin-section">
                        <div className="admin-cards-grid">
                            <div className="card">
                                <div className="card-title">
                                    <h2>Products</h2>
                                    <span>
                                        {products.length} items
                                    </span>
                                </div>

                                {productsError && (
                                    <div className="status-msg err">
                                        {productsError}
                                    </div>
                                )}
                                {productsLoading && (
                                    <div className="status-msg">
                                        Загружаем продукты...
                                    </div>
                                )}

                                {!productsLoading && !productsError && (
                                    <table className="admin-table">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Active</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.id}</td>
                                                <td>{p.name}</td>
                                                <td>
                                                    {p.categoryName ||
                                                        p.category ||
                                                        ""}
                                                </td>
                                                <td>
                                                    {p.price?.toFixed
                                                        ? p.price.toFixed(
                                                            2
                                                        )
                                                        : p.price ??
                                                        p.basePrice ??
                                                        0}{" "}
                                                    MDL
                                                </td>
                                                <td>
                                                    {p.active
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                            </tr>
                                        ))}
                                        {!products.length && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="small"
                                                >
                                                    Нет продуктов в
                                                    каталоге.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="card">
                                <div className="card-title">
                                    <h2>New product</h2>
                                    <span>Create</span>
                                </div>

                                <form
                                    className="form-grid"
                                    onSubmit={handleProductSubmit}
                                >
                                    <div>
                                        <label>Name</label>
                                        <input
                                            className="input"
                                            value={productForm.name}
                                            onChange={(e) =>
                                                handleProductFormChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Description</label>
                                        <textarea
                                            className="textarea"
                                            value={
                                                productForm.description
                                            }
                                            onChange={(e) =>
                                                handleProductFormChange(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>
                                            Base price (MDL)
                                        </label>
                                        <input
                                            className="input"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={productForm.price}
                                            onChange={(e) =>
                                                handleProductFormChange(
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Category</label>
                                        <input
                                            className="input"
                                            value={
                                                productForm.category
                                            }
                                            onChange={(e) =>
                                                handleProductFormChange(
                                                    "category",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="CAKE / DESSERT / CUSTOM ..."
                                        />
                                    </div>
                                    <div>
                                        <label>
                                            Image URL (optional)
                                        </label>
                                        <input
                                            className="input"
                                            value={
                                                productForm.imageUrl
                                            }
                                            onChange={(e) =>
                                                handleProductFormChange(
                                                    "imageUrl",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    productForm.active
                                                }
                                                onChange={(e) =>
                                                    handleProductFormChange(
                                                        "active",
                                                        e.target.checked
                                                    )
                                                }
                                            />{" "}
                                            Active
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn-primary mt-8"
                                    >
                                        Save product
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {/* CUSTOMERS */}
                {activeTab === "customers" && (
                    <section className="admin-section">
                        <div className="admin-cards-grid">
                            <div className="card">
                                <div className="card-title">
                                    <h2>Customers</h2>
                                    <span>
                                        {customers.length} customers
                                    </span>
                                </div>

                                {customersError && (
                                    <div className="status-msg err">
                                        {customersError}
                                    </div>
                                )}
                                {customersLoading && (
                                    <div className="status-msg">
                                        Загружаем клиентов...
                                    </div>
                                )}

                                {!customersLoading && !customersError && (
                                    <table className="admin-table">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {customers.map((c) => (
                                            <tr key={c.id}>
                                                <td>{c.id}</td>
                                                <td>{c.name}</td>
                                                <td>{c.email}</td>
                                                <td>{c.phone}</td>
                                                <td>
                                                    {c.role || ""}
                                                </td>
                                            </tr>
                                        ))}
                                        {!customers.length && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="small"
                                                >
                                                    Нет клиентов.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="card">
                                <div className="card-title">
                                    <h2>Quick register</h2>
                                </div>

                                <form
                                    className="form-grid"
                                    onSubmit={handleCustomerSubmit}
                                >
                                    <div>
                                        <label>Name</label>
                                        <input
                                            className="input"
                                            value={customerForm.name}
                                            onChange={(e) =>
                                                handleCustomerFormChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input
                                            className="input"
                                            type="email"
                                            value={customerForm.email}
                                            onChange={(e) =>
                                                handleCustomerFormChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Phone</label>
                                        <input
                                            className="input"
                                            value={customerForm.phone}
                                            onChange={(e) =>
                                                handleCustomerFormChange(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>Password</label>
                                        <input
                                            className="input"
                                            type="password"
                                            value={
                                                customerForm.password
                                            }
                                            onChange={(e) =>
                                                handleCustomerFormChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary mt-8"
                                    >
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {/* PAYMENTS */}
                {activeTab === "payments" && (
                    <section className="admin-section">
                        <div className="admin-cards-grid">
                            <div className="card">
                                <div className="card-title">
                                    <h2>Payments</h2>
                                    <span>
                                        {payments.length} payments
                                    </span>
                                </div>

                                {paymentsError && (
                                    <div className="status-msg err">
                                        {paymentsError}
                                    </div>
                                )}
                                {paymentsLoading && (
                                    <div className="status-msg">
                                        Загружаем платежи...
                                    </div>
                                )}

                                {!paymentsLoading && !paymentsError && (
                                    <table className="admin-table">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Order</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Method</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {payments.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.id}</td>
                                                <td>{p.orderId}</td>
                                                <td>
                                                    {p.amount ?? ""}{" "}
                                                    {p.currency || ""}
                                                </td>
                                                <td>
                                                    {p.status || ""}
                                                </td>
                                                <td>
                                                    {p.method || ""}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn-sm btn-outline"
                                                        onClick={() =>
                                                            confirmPayment(
                                                                p.id
                                                            )
                                                        }
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-sm btn-outline"
                                                        onClick={() =>
                                                            refundPayment(
                                                                p.id
                                                            )
                                                        }
                                                    >
                                                        Refund
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!payments.length && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="small"
                                                >
                                                    Нет платежей.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="card">
                                <div className="card-title">
                                    <h2>Create payment</h2>
                                    <span>For existing order</span>
                                </div>

                                <form
                                    className="form-grid"
                                    onSubmit={handlePaymentSubmit}
                                >
                                    <div>
                                        <label>Order ID</label>
                                        <input
                                            className="input"
                                            type="number"
                                            min="1"
                                            value={paymentForm.orderId}
                                            onChange={(e) =>
                                                handlePaymentFormChange(
                                                    "orderId",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Amount</label>
                                        <input
                                            className="input"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={paymentForm.amount}
                                            onChange={(e) =>
                                                handlePaymentFormChange(
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Currency</label>
                                        <input
                                            className="input"
                                            value={
                                                paymentForm.currency
                                            }
                                            onChange={(e) =>
                                                handlePaymentFormChange(
                                                    "currency",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>Method</label>
                                        <input
                                            className="input"
                                            value={
                                                paymentForm.method
                                            }
                                            onChange={(e) =>
                                                handlePaymentFormChange(
                                                    "method",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary mt-8"
                                    >
                                        Create
                                    </button>
                                    <div className="small mt-8">
                                        После создания можно
                                        подтвердить платёж или
                                        вернуть.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {/* NOTIFICATIONS */}
                {activeTab === "notifications" && (
                    <section className="admin-section">
                        <div className="card">
                            <div className="card-title">
                                <h2>Notifications</h2>
                                <span>
                                    {notifications.length} notifications
                                </span>
                            </div>

                            {notificationsError && (
                                <div className="status-msg err">
                                    {notificationsError}
                                </div>
                            )}
                            {notificationsLoading && (
                                <div className="status-msg">
                                    Загружаем уведомления...
                                </div>
                            )}

                            {!notificationsLoading &&
                                !notificationsError && (
                                    <table className="admin-table">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Type</th>
                                            <th>Channel</th>
                                            <th>Recipient</th>
                                            <th>Text</th>
                                            <th>Order</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {notifications.map((n) => (
                                            <tr key={n.id}>
                                                <td>{n.id}</td>
                                                <td>{n.type}</td>
                                                <td>{n.channel}</td>
                                                <td>{n.recipient}</td>
                                                <td className="small">
                                                    {n.subject}
                                                    <br />
                                                    {n.body}
                                                </td>
                                                <td>
                                                    {n.orderId ?? ""}
                                                </td>
                                            </tr>
                                        ))}
                                        {!notifications.length && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="small"
                                                >
                                                    Нет уведомлений.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                )}
                        </div>
                    </section>
                )}

                <div className="footer-mini">
                    © {year} CakeFactory · Admin
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
