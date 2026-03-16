import React from "react";

export const CustomerForm = ({form, onChange, onSubmit}) => (
    <form className="form-grid" onSubmit={onSubmit}>
        <div>
            <label>Name</label>
            <input className="input" value={form.name} onChange={e => onChange("name", e.target.value)}/>
        </div>
        <div>
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={e => onChange("email", e.target.value)}
                   required/>
        </div>
        <div>
            <label>UserName</label>
            <input className="input" value={form.fullName} onChange={e => onChange("fullName", e.target.value)}/>
        </div>
        <div>
            <label>Phone</label>
            <input className="input" value={form.phone} onChange={e => onChange("phone", e.target.value)}/>
        </div>
        <div>
            <label>Password</label>
            <input className="input" type="password" value={form.password}
                   onChange={e => onChange("password", e.target.value)} required/>
        </div>
        <button type="submit" className="btn-primary mt-8">Register</button>
    </form>
);