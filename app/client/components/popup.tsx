
// Popup.tsx
import type { ReactNode } from "react";
import "./popup.css";

interface PopupProps {
    message: string;
    children?: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function Popup({ message, children, onConfirm, onCancel }: PopupProps) {
    return (
        <div className="overlay">
            <div className="popup">
                <p>{message}</p>
                {children}
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export type { PopupProps };