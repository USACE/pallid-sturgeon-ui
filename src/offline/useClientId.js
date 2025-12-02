import { useState, useEffect } from "react"

export function useClientId(Key = 'moriver-draft') {
    const [id, setId] = useState(null);

    useEffect(() => {
        let val = sessionStorage.getItem(key);
        if (!val) {
            val = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).toString();
            sessionStorage.setItem(key, val);
        }
        setId(val);
    }, [key]);

    return id;
}