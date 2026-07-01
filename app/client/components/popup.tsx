
// Popup.tsx
interface PopupProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function Popup({ message, onConfirm, onCancel }: PopupProps) {
    return (
        <div className="overlay">
            <div className="popup">
                <p>{message}</p>
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export type { PopupProps };