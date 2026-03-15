import { useCallback, useEffect, useState } from "react";

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
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        const tokens = safeReadJson(TOKENS_KEY);
        const accessToken = tokens?.accessToken || tokens?.token;

        if (!accessToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        const profile = safeReadJson(PROFILE_KEY);

        if (profile?.id) {
            setUser({ ...profile, accessToken });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to load profile: ${response.status}`);
            }

            const me = await response.json();

            localStorage.setItem(PROFILE_KEY, JSON.stringify(me));
            setUser({ ...me, accessToken });
        } catch (error) {
            console.error("Failed to load current user profile:", error);
            setUser({ accessToken });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const handler = () => load();
        window.addEventListener("user:updated", handler);
        return () => window.removeEventListener("user:updated", handler);
    }, [load]);

    const logout = () => {
        localStorage.removeItem("currentCustomer");
        localStorage.removeItem("token");

        setUser(null);
        window.dispatchEvent(new Event("user:updated"));
    };


    return { user, logout, loading, reloadUser: load };
};