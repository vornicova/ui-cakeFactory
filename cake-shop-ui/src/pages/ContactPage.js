// src/pages/ContactPage.js
import React from "react";

const ContactPage = () => {
    return (
        <section className="card">
            <h1>Contact us</h1>
            <p>Добро пожаловать в мир сладких приключений...</p>

            <div className="info-grid">
                <div className="info-box">
                    <div className="info-box-title">Адрес</div>
                    <div className="info-box-text">
                        г. Кишинёв, ул. Сладкая, 15
                        <br />
                        Ежедневно с 09:00 до 20:00
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-box-title">Телефон</div>
                    <div className="info-box-text">
                        +373 (60) 000 000
                        <br />
                        hello@cakefactory.test
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-box-title">Соцсети</div>
                    <div className="info-box-text">
                        Instagram: @cakefactory
                        <br />
                        Facebook: /cakefactory
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;