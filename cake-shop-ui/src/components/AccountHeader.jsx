import React from "react";

const AccountHeader = ({ user, onLogout }) => {
    const displayName =
        user?.fullName ||
        user?.name ||
        user?.username ||
        user?.email ||
        "Пользователь";

    const displayEmail =
        user?.email ||
        user?.username ||
        "—";

    return (
        <section className="card account-header">
            <div>
                <h1>Привет, {displayName}</h1>
                <p>Email: {displayEmail}</p>
            </div>

            <div className="account-header-actions">
                <button type="button" className="btn-outline" onClick={onLogout}>
                    Выйти
                </button>
            </div>
        </section>
    );
};

export default AccountHeader;