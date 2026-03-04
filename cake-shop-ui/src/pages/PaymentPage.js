import { createPayment } from "../api/api";
import { useState } from "react";

function PaymentPage() {
    const [loading, setLoading] = useState(false);
    const orderId = localStorage.getItem("orderId");

    const handlePay = async () => {
        if (!orderId) {
            alert("Нет заказа для оплаты");
            return;
        }

        setLoading(true);
        try {
            await createPayment({
                orderId: Number(orderId),
                amount: 100.0, // TODO: можно подтянуть реальную сумму заказа
                method: "CARD"
            });
            alert("Оплата успешно создана (PENDING). Дальше логика payment-service.");
        } catch (e) {
            alert("Ошибка оплаты: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <h1>Оплата заказа #{orderId}</h1>
            <p>Здесь можно вывести форму ввода карты и т.д. (пока простая кнопка).</p>

            <button className="btn" onClick={handlePay} disabled={loading}>
                {loading ? "Оплата..." : "Оплатить"}
            </button>
        </div>
    );
}

export default PaymentPage;
