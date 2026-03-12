import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FLAVOURS } from "../features/customCake/constants/flavours";
import {
    normalizePositiveNumber,
    calculateEstimatedPrice,
} from "../features/customCake/utils/pricing";
import { useCurrentCustomer } from "../features/customCake/hooks/useCurrentCustomer";
import { useSelectedCakeDesign } from "../features/customCake/hooks/useSelectedCakeDesign";
import { CakePreview } from "../features/customCake/components/CakePreview";
import { CustomCakeForm } from "../features/customCake/components/CustomCakeForm";
import {
    calculateRecommendedWeightByGuests,
    calculateRecommendedSizeByGuests,
} from "../features/customCake/utils/guestSizing";
import "../styles/customCake.css";

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
    const selectedDesign = useSelectedCakeDesign();

    const [customProduct, setCustomProduct] = useState(null);
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState("");

    const [form, setForm] = useState(() => ({
        shape: "Круглый",
        size: "18",
        layers: "1",
        servings: 12,
        weight: 2,
        manualWeight: false,

        selectedFlavourId: FLAVOURS[0]?.id ?? null,

        decor: "Минималистичный",
        inscription: "",
        extraComment: "",

        decorPreview: null,
        decorFileName: null,

        selectedDesign: null,

        useAiDesign: false,
        aiDesignPrompt: "",
        aiDesignStyle: "Нежный",
        aiDesignImage: null,
        aiDesignStatus: "idle",
    }));

    const recommendedWeight = useMemo(
        () => calculateRecommendedWeightByGuests(form.servings),
        [form.servings]
    );

    const recommendedSize = useMemo(
        () => calculateRecommendedSizeByGuests(form.servings),
        [form.servings]
    );

    useEffect(() => {
        if (form.manualWeight) return;

        setForm((prev) => ({
            ...prev,
            weight: recommendedWeight,
        }));
    }, [recommendedWeight, form.manualWeight]);

    useEffect(() => {
        const fetchCustomProduct = async () => {
            try {
                const resp = await fetch(`${API_BASE}/products`);
                if (!resp.ok) {
                    throw new Error(`API error ${resp.status}`);
                }

                const data = await resp.json();
                const found =
                    (data || []).find(
                        (p) =>
                            (p.category &&
                                String(p.category).toUpperCase() === "CUSTOM") ||
                            (p.name &&
                                String(p.name).toLowerCase().includes("custom"))
                    ) || null;

                if (!found) {
                    setStatus(
                        'В каталоге не найден продукт категории CUSTOM. Создайте товар "Custom cake" через админку.'
                    );
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

    useEffect(() => {
        if (!selectedDesign) return;

        setForm((prev) => ({
            ...prev,
            selectedDesign,
            shape: selectedDesign.shape || prev.shape,
            decor: selectedDesign.decor || prev.decor,
            layers: selectedDesign.layers || prev.layers,
        }));
    }, [selectedDesign]);

    const currentFlavour = useMemo(() => {
        if (!form.selectedFlavourId) return null;
        return FLAVOURS.find((f) => f.id === form.selectedFlavourId) || null;
    }, [form.selectedFlavourId]);

    const weightKg = useMemo(() => {
        const baseWeight = form.manualWeight ? form.weight : recommendedWeight;
        return normalizePositiveNumber(baseWeight, recommendedWeight || 2);
    }, [form.manualWeight, form.weight, recommendedWeight]);

    const finalCakeSize = useMemo(() => {
        return form.size || recommendedSize;
    }, [form.size, recommendedSize]);

    const designExtraPrice = useMemo(() => {
        return Number(form.selectedDesign?.decorPrice || 0);
    }, [form.selectedDesign?.decorPrice]);

    const estimatedPrice = useMemo(() => {
        const basePrice = calculateEstimatedPrice({
            customProduct,
            weightKg,
            layers: form.layers,
            decor: form.decor,
            flavourId: currentFlavour?.id,
        });

        return Number(basePrice || 0) + designExtraPrice;
    }, [
        customProduct,
        weightKg,
        form.layers,
        form.decor,
        currentFlavour?.id,
        designExtraPrice,
    ]);

    const activeDesignSource = useMemo(() => {
        if (form.aiDesignImage) {
            return {
                type: "ai",
                name: "AI Design",
                imageUrl: form.aiDesignImage,
            };
        }

        if (form.selectedDesign) {
            return {
                type: "catalog",
                name: form.selectedDesign.name,
                imageUrl: form.selectedDesign.imageUrl,
                code: form.selectedDesign.code,
                decorPrice: form.selectedDesign.decorPrice,
            };
        }

        if (form.decorPreview?.src) {
            return {
                type: "upload",
                name: form.decorPreview.name || "Uploaded design",
                imageUrl: form.decorPreview.src,
            };
        }

        return null;
    }, [form.aiDesignImage, form.selectedDesign, form.decorPreview]);

    const year = new Date().getFullYear();

    const handleDecorFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setForm((prev) => ({
                ...prev,
                decorFileName: null,
                decorPreview: null,
            }));
            return;
        }

        const reader = new FileReader();

        reader.onload = (ev) => {
            setForm((prev) => ({
                ...prev,
                decorFileName: file.name,
                decorPreview: {
                    src: ev.target?.result,
                    name: file.name,
                },
                selectedDesign: null,
                aiDesignImage: null,
                aiDesignStatus: "idle",
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

        const cartItem = {
            id: `custom-${Date.now()}`,
            productId: customProduct.id,
            name: "Custom Cake",
            price: estimatedPrice ?? 0,
            quantity: 1,
            type: "CUSTOM_CAKE",
            customData: {
                shape: form.shape,
                size: finalCakeSize,
                recommendedSize,
                layers: form.layers,
                servings: form.servings,
                weight: weightKg,
                recommendedWeight,
                manualWeight: form.manualWeight,

                flavourId: currentFlavour?.id ?? null,
                flavourName: currentFlavour?.name ?? null,

                decor: form.decor,
                inscription: form.inscription,
                comment: form.extraComment,
                decorFileName: form.decorFileName,

                designId: form.selectedDesign?.id ?? null,
                designName: form.selectedDesign?.name ?? null,
                designCode: form.selectedDesign?.code ?? null,
                designImageUrl: form.selectedDesign?.imageUrl ?? null,
                designDecorPrice: Number(form.selectedDesign?.decorPrice || 0),

                useAiDesign: form.useAiDesign,
                aiDesignPrompt: form.aiDesignPrompt,
                aiDesignStyle: form.aiDesignStyle,
                aiDesignImage: form.aiDesignImage,

                activeDesignType: activeDesignSource?.type ?? null,
                activeDesignName: activeDesignSource?.name ?? null,
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
                    onDecorFileChange={handleDecorFileChange}
                    onAddToCart={handleAddToCart}
                    status={status}
                    statusType={statusType}
                    activeDesignSource={activeDesignSource}
                    recommendedWeight={recommendedWeight}
                    recommendedSize={recommendedSize}
                />

                <CakePreview
                    shape={form.shape}
                    size={finalCakeSize}
                    layers={form.layers}
                    servings={form.servings}
                    weightKg={weightKg}
                    flavour={currentFlavour}
                    estimatedPrice={estimatedPrice}
                    imageBase={IMAGE_BASE}
                    activeDesignSource={activeDesignSource}
                />
            </div>

            <div className="footer-mini">© {year} CakeFactory · Custom cake</div>
        </div>
    );
};

export default CustomCakePage;