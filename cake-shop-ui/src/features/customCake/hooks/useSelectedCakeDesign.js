import { useEffect, useState } from "react";

function safeReadSelectedCakeDesign() {
    try {
        const raw = localStorage.getItem("selectedCakeDesign");
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error("Cannot parse selectedCakeDesign", e);
        return null;
    }
}

export function useSelectedCakeDesign() {
    const [selectedDesign, setSelectedDesign] = useState(null);

    useEffect(() => {
        const design = safeReadSelectedCakeDesign();
        setSelectedDesign(design);
    }, []);

    return selectedDesign;
}