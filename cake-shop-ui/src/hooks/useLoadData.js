import { useState, useCallback } from "react";
import { apiGet } from "../api/api";

export const useLoadData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await apiGet(url);
            setData(Array.isArray(res) ? res : []);
        } catch (e) {
            console.error(e);
            setError(e.message || "Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    }, [url]);

    return { data, loading, error, load };
};