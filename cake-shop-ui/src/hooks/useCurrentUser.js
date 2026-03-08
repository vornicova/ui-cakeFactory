// src/hooks/useCurrentUser.js
import { useEffect, useState } from "react";

const TOKENS_KEY = "authTokens";
const PROFILE_KEY = "currentUserProfile";

function safeReadJson(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export const useCurrentUser = () => {
    const [user, setUser] = useState(null);

    const load = () => {
        const tokens = safeReadJson(TOKENS_KEY);
        if (!tokens?.accessToken) {
            setUser(null);
            return;
        }

        const profile = safeReadJson(PROFILE_KEY) || {};
        setUser({ ...profile, ...tokens });
    };

    useEffect(() => {
        load();
        const handler = () => load();
        window.addEventListener("user:updated", handler);
        return () => window.removeEventListener("user:updated", handler);
    }, []);

    const logout = () => {
        localStorage.removeItem(TOKENS_KEY);
        localStorage.removeItem(PROFILE_KEY);
        setUser(null);
        window.dispatchEvent(new Event("user:updated"));
    };

    return { user, logout };
};