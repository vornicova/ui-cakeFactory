import React from "react";
import "../../styles/homePageExtras.css";

function HomePageExtras() {
    return (
        <div className="homepage-extras">
            <section className="delivery-section">
                <div className="delivery-content">
                    <div className="delivery-text">
                        <span className="section-badge">DELIVERY & PAYMENT</span>
                        <h2>Доставка и оплата</h2>

                        <p className="delivery-main">
                            Бесплатная доставка по городу при заказе от 1000 лей.
                            Мы аккуратно упаковываем десерты и доставляем их в идеальном состоянии.
                        </p>

                        <div className="delivery-features">
                            <div className="delivery-card">
                                <h3>5% скидка онлайн</h3>
                                <p>
                                    Оплачивайте заказ онлайн и получайте скидку 5% на покупку.
                                </p>
                            </div>

                            <div className="delivery-card">
                                <h3>Удобная оплата</h3>
                                <p>
                                    Доступна оплата картой, наличными курьеру и онлайн на сайте.
                                </p>
                            </div>

                            <div className="delivery-card">
                                <h3>Бережная доставка</h3>
                                <p>
                                    Мы доставляем торты и десерты с соблюдением температурного режима.
                                </p>
                            </div>
                        </div>

                        <div className="payment-icons">
                            <span>VISA</span>
                            <span>Mastercard</span>
                            <span>Apple Pay</span>
                        </div>
                    </div>

                    <div className="delivery-image">
                        <img
                            src="/images/home/delivery-box.png"
                            alt="Подарочная коробка с десертами"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePageExtras;