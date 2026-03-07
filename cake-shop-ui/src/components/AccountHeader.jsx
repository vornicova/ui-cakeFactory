import React from "react";

const AccountHeader = ({user, onLogout}) => (
    <section className="card account-header">
        <div>
            <h1>Привет, {user?.fullName} </h1>
            <p>Email: {user?.email || "—"}</p>
        </div>

        <div className="account-header-actions">
            <button type="button" className="btn-outline" onClick={onLogout}>
                Выйти
            </button>
        </div>
    </section>
);

export default AccountHeader;