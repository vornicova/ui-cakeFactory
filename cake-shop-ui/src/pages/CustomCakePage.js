// src/pages/CustomCakePage.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FLAVOURS } from "../features/customCake/constants/flavours";
import { normalizePositiveNumber, calculateEstimatedPrice } from "../features/customCake/utils/pricing";
import { useCurrentCustomer } from "../features/customCake/hooks/useCurrentCustomer";
import { CakePreview } from "../features/customCake/components/CakePreview";
import { CustomCakeForm } from "../features/customCake/components/CustomCakeForm";

const API_BASE = "/api";
const IMAGE_BASE = "http://localhost:8081";

function safeReadCartItems() {
    try {
        const raw = localStorage.getItem("cartItems");
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Cannot parse cartItems", e);
        return [];
    }
}

function safeWriteCartItems(items) {
    try {
        localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (e) {
        console.error("Cannot write cartItems", e);
    }
}

const CustomCakePage = () => {
    const navigate = useNavigate();
    const customer = useCurrentCustomer();

    const [customProduct, setCustomProduct] = useState(null);

    // форма (в одном объекте — так проще прокидывать в CustomCakeForm)
    const [form, setForm] = useState(() => ({
        shape: "Круглый",
        size: "18",
        layers: "1",
        servings: 12,
        weight: 2,

        selectedFlavourId: FLAVOURS[0]?.id ?? null,

        decor: "Минималистичный",
        pickup: "",
        sweetness: "умеренная",
        inscription: "",
        extraComment: "",

        decorPreview: null,
        decorFileName: null,
    }));

    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState(""); // ok | err | ""

    // грузим CUSTOM продукт
    useEffect(() => {
        const fetchCustomProduct = async () => {
            try {
                const resp = await fetch(`${API_BASE}/products`);
                if (!resp.ok) throw new Error("API error " + resp.status);

                const data = await resp.json();
                const found =
                    (data || []).find(
                        (p) =>
                            (p.category && String(p.category).toUpperCase() === "CUSTOM") ||
                            (p.name && String(p.name).toLowerCase().includes("custom"))
                    ) || null;

                if (!found) {
                    setStatus('В каталоге не найден продукт категории CUSTOM. Создайте товар "Custom cake" через админку.');
                    setStatusType("err");
                }

                setCustomProduct(found);
            } catch (e) {
                console.error(e);
                setStatus("Ошибка загрузки продуктов для кастомного торта.");
                setStatusType("err");
                setCustomProduct(null);
            }
        };

        fetchCustomProduct();
    }, []);

    const currentFlavour = useMemo(() => {
        if (!form.selectedFlavourId) return null;
        return FLAVOURS.find((f) => f.id === form.selectedFlavourId) || null;
    }, [form.selectedFlavourId]);

    const weightKg = useMemo(() => normalizePositiveNumber(form.weight, 2), [form.weight]);

    const estimatedPrice = useMemo(() => {
        return calculateEstimatedPrice({
            customProduct,
            weightKg,
            layers: form.layers,
            decor: form.decor,
            flavourId: currentFlavour?.id,
        });
    }, [customProduct, weightKg, form.layers, form.decor, currentFlavour?.id]);

    const minPickup = useMemo(() => new Date().toISOString().slice(0, 16), []);
    const year = new Date().getFullYear();

    const handleDecorFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setForm((p) => ({ ...p, decorFileName: null, decorPreview: null }));
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setForm((p) => ({
                ...p,
                decorFileName: file.name,
                decorPreview: { src: ev.target?.result, name: file.name },
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddToCart = () => {
        setStatus("");
        setStatusType("");

        if (!customer) {
            setStatus("Чтобы добавить кастомный торт в корзину, войдите в аккаунт.");
            setStatusType("err");
            setTimeout(() => navigate("/account"), 900);
            return;
        }

        if (!customProduct) {
            setStatus("Продукт CUSTOM не найден.");
            setStatusType("err");
            return;
        }

        if (!form.pickup) {
            setStatus("Пожалуйста, выберите дату и время получения торта.");
            setStatusType("err");
            return;
        }

        const cartItem = {
            id: `custom-${Date.now()}`, // локальный id для корзины
            productId: customProduct.id,
            name: "Custom Cake",
            price: estimatedPrice ?? 0,
            quantity: weightKg, // вес как quantity
            type: "CUSTOM_CAKE",
            customData: {
                shape: form.shape,
                size: form.size,
                layers: form.layers,
                servings: form.servings,
                weight: weightKg,
                flavourId: currentFlavour?.id ?? null,
                flavourName: currentFlavour?.name ?? null,
                decor: form.decor,
                sweetness: form.sweetness,
                inscription: form.inscription,
                pickup: form.pickup,
                comment: form.extraComment,
                decorFileName: form.decorFileName,
            },
        };

        const items = safeReadCartItems();
        items.push(cartItem);
        safeWriteCartItems(items);

        setStatus("Кастомный торт добавлен в корзину!");
        setStatusType("ok");

        setTimeout(() => navigate("/cart"), 600);
    };

    return (
        <div className="page">
            <div className="page-title">
                <h1>Создать персональный торт</h1>
                <p>Выберите форму, вкус и декор. Создайте торт своей мечты!</p>
            </div>

            <div className="layout custom-layout">
                <CustomCakeForm
                    imageBase={IMAGE_BASE}
                    state={form}
                    setState={setForm}
                    minPickup={minPickup}
                    onDecorFileChange={handleDecorFileChange}
                    onAddToCart={handleAddToCart}
                    status={status}
                    statusType={statusType}
                />

                <CakePreview
                    shape={form.shape}
                    size={form.size}
                    layers={form.layers}
                    servings={form.servings}
                    weightKg={weightKg}
                    decor={form.decor}
                    flavour={currentFlavour}
                    estimatedPrice={estimatedPrice}
                    imageBase={IMAGE_BASE}
                />
            </div>

            <div className="footer-mini">© {year} CakeFactory · Custom cake</div>
        </div>
    );
};

export default CustomCakePage;