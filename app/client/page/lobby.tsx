import { useEffect, useState, CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendLink = process.env.VITE_BACKEND;

export default function Lobby() {
    const { userId } = useParams();
    const [lobbyData, setLobbyData] = useState(null);
    const navigate = useNavigate();

    const lobbyCSS : CSSProperties = {
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1rem 1.25rem",
        marginBottom: "1rem",
        cursor: "pointer",
        transition: "border-color 0.15s",
    }

    useEffect(() => {
        const fetchLobby = async () => {
        try {
            const response = await fetch(`${backendLink}/games`);
            const data = await response.json();
            setLobbyData(data);
        } catch (error) {
            console.error("Failed to fetch lobby:", error);
        }
        };

        if (userId) fetchLobby();
    }, [userId]);

    useEffect(() => {
        console.log(lobbyData);
    }, [lobbyData]);

    const formatDate = (timestamp) => {
        return new Date(timestamp._seconds * 1000).toLocaleDateString();
    };

    return (
        <div style={{ padding: "2rem" }}>
        <h2>Games in Lobby</h2>
        {lobbyData != null ? lobbyData.map((game) => (
            <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}/${userId}`)}
            style={lobbyCSS}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-border-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}
            >
            {/* Top Row: Game ID + Status Badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontWeight: 500, fontSize: "15px" }}>{game.id}</span>
                <span style={{
                    fontSize: "12px",
                    padding: "3px 10px",
                    borderRadius: "var(--border-radius-md)",
                    background: game.active ? "var(--color-background-success)" : "var(--color-background-secondary)",
                    color: game.active ? "var(--color-text-success)" : "var(--color-text-secondary)",
                }}>
                {game.active ? "Active" : "Ended"}
                </span>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "0.75rem" }}>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Turn</p>
                <p style={{ fontSize: "18px", fontWeight: 500, margin: 0 }}>{game.turnNumber}</p>
                </div>
                <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "0.75rem" }}>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Players</p>
                <p style={{ fontSize: "18px", fontWeight: 500, margin: 0 }}>{game.players.length}</p>
                </div>
                <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "0.75rem" }}>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Created</p>
                <p style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}>{formatDate(game.createdAt)}</p>
                </div>
            </div>

            {/* Winner (only shows if game is over) */}
            {game.winner && (
                <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                Winner: <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{game.winner}</span>
                </p>
            )}
            </div>
        )): "Loading Lobby Data..."}
        </div>
    );
}