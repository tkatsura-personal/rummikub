import { useEffect, useState, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase";
import Popup from "../components/popup";
import ActionButton from "../components/Button";

const backendLink = import.meta.env.VITE_BACKEND;

export default function Lobby() {
    const [lobbyData, setLobbyData] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [playerCount, setPlayerCount] = useState(2);
    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const user = auth.currentUser;

    const lobbyCSS : CSSProperties = {
        background: "#009933",
        border: "0.5px solid #000000",
        borderRadius: "var(--border-radius-lg)",
        padding: "1rem 1.25rem",
        marginBottom: "1rem",
        cursor: "pointer",
        transition: "border-color 0.15s",
    }

    const lobbyListCSS : CSSProperties = {
        maxHeight: "70vh",
        overflowY: "auto",
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

        if (user.uid) fetchLobby();
    }, [user.uid]);

    const formatDate = (timestamp) => {
        return new Date(timestamp._seconds * 1000).toLocaleDateString();
    };

    const handleCreateGame = async () => {
        setShowCreatePopup(false);
        try {
            const response = await fetch(`${backendLink}/games`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, playerCount }),
            });
            const data = await response.json();
            if (response.status === 201) {
                navigate(`/game/${data.id}`);
            } else {
                alert(`Failed to create game: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to create game:", error);
        }
    };

    const handleJoinGame = async (gameId: string) => {
        try {
            const response = await fetch(`${backendLink}/games/${gameId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid }),
            });
            const data = await response.json();
            if (response.status === 201) {
                navigate(`/game/${gameId}`);
            } else {
                alert(`Could not join game: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to join game:", error);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Games in Lobby</h2>
            <ActionButton label="Create Game" onClick={() => setShowCreatePopup(true)} />
        </div>
        <div style={lobbyListCSS}>
        {lobbyData != null ? lobbyData.map((game) => (
            <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
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

            {/* Join button (only shows if the game is joinable and the current user isn't already in it) */}
            {game.active === 0 && game.players.length < game.playerCount &&
             !game.players.some((p) => p.uid === user.uid) && (
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "12px" }}>
                    <ActionButton label="Join" onClick={() => handleJoinGame(game.id)} />
                </div>
            )}
            </div>
        )): "Loading Lobby Data..."}
        </div>

        {showCreatePopup && (
            <Popup
                message="Create a new game?"
                onConfirm={handleCreateGame}
                onCancel={() => setShowCreatePopup(false)}
            >
                <label>
                    Number of players:{" "}
                    <select value={playerCount} onChange={(e) => setPlayerCount(Number(e.target.value))}>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </label>
            </Popup>
        )}
        </div>
    );
}