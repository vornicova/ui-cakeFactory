import React from "react";
import { Link } from "react-router-dom";
import { homeWideCards } from "../../data/homeContent";

const HomeWideCards = () => {
    return (
        <section className="home-section">
            <div className="home-wide-grid">
                {homeWideCards.map((item) => (
                    <article className="home-wide-card" key={item.id}>
                        <img src={item.imageUrl} alt={item.title} />

                        <div className="home-wide-overlay">
                            <h3>{item.title}</h3>

                            <Link to={item.link} className="home-card-btn">
                                {item.buttonText}
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default HomeWideCards;