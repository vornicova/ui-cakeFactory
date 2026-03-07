import React from "react";
import { Link } from "react-router-dom";
import { homeCategories } from "../../data/homeContent";

const HomeCategories = () => {
    return (
        <section className="home-section">
            <div className="home-section-title">
                <span>About us</span>
            </div>

            <div className="home-categories-grid">
                {homeCategories.map((item) => (
                    <article className="home-category-card" key={item.id}>
                        <img src={item.imageUrl} alt={item.title} />

                        <div className="home-category-overlay">
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

export default HomeCategories;