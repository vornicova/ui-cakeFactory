import React from "react";
import { Link } from "react-router-dom";

const HomeHero = () => {
    return (
        <section  className="home-hero"
                  style={{ backgroundImage: "url(/images/home/home-hero.jpg)" }}>
            <div className="home-hero-copy">
                <span className="home-hero-kicker">Sweet bakery</span>

                <h1>Bakery</h1>

                <p>
                    Elegant cakes, cupcakes and desserts for your sweetest moments.
                </p>

                <div className="home-hero-actions">
                    <Link to="/menu" className="btn-primary">
                        Shop now
                    </Link>

                    <Link to="/custom-cake" className="home-hero-outline">
                        Create cake
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;