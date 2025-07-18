import { useEffect, useState } from "react";

export default function Alert({ message, type = "success", duration = 3000 }) {
    const [visible, setVisible] = useState(!!message);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    if (!visible || !message) return null;

    const bgColor = type === "error" ? "bg-red-500" : "bg-emerald-500";

    return (
        <div className={`${bgColor} py-2 px-4 text-white rounded mb-4`} role="alert">
            {message}
        </div>
    );
}