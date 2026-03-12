import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useSelectedCakeDesign() {
    const location = useLocation();

    return useMemo(() => {
        if (location.state?.selectedDesign) {
            return location.state.selectedDesign;
        }

        try {
            const raw = localStorage.getItem("selectedCakeDesign");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error("Cannot parse selectedCakeDesign", e);
            return null;
        }
    }, [location.state]);
}