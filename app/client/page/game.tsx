'use client';
// React imports
import { useEffect, useRef, useState, CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import components
import HandRow from "../components/HandRow";
import TileSet from "../components/TileSet";
import ActionButton from "../components/Button";
import Popup from "./popup";

//css imports
import "./game.css";
type PopupType = "draw-card" | "no-tile-moved" | "invalid-board" | "confirm-hand" | "not-your-turn" | "turn-successful" | "no-more-tiles" | null;

export default function game() {
    const { gameId, userId } = useParams();
    const TileSetList = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];
    const [loadingTable, setLoadingTable] = useState(true);
    const [loadingHand, setLoadingHand] = useState(true);
    const [errorTable, setErrorTable] = useState(null);
    const [errorHand, setErrorHand] = useState(null);
    
    const [table, setTable] = useState<Record<string,string[]>>({});
    const [hand, setHand] = useState<Record<string,string[]>>({});
    const [isValidSet, setTileValid] = useState<Record<string, boolean>>({});
    const [hasHandTile, setHasHandTile] = useState<Record<string, boolean>>(
        Object.fromEntries(TileSetList.map((tileSetNum) => [tileSetNum, false]))
    );
    const validDropRef = useRef<boolean>(false);
    const [activePopup, setActivePopup] = useState<PopupType>(null);

    const handleBoardTileChange = (setId: string, tileList: string[], hasHandTile: boolean, isValid: boolean) => {
        setTable(prev => ({...prev, [setId]: tileList}));
        setHasHandTile(prev => ({ ...prev, [setId]: hasHandTile }));
        setTileValid(prev => ({ ...prev, [setId]: isValid }));
    };

    const handleHandTileChange = (setId: string, tileList: string[]) => {
        setHand(prev => ({...prev, [setId]: tileList}));
    };

    const containerStyleTileSet: CSSProperties = {
        overflowY: 'scroll',
        position: 'relative',
        border: '1px solid black',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '100%',
        height: '50%',
    }

    const containerStyle: CSSProperties = {
        position: 'relative',
        border: '1px solid black',
        display: 'flex',
        flexWrap: 'wrap',
        width: '80%',
        height: '45%',
    }

    // Grab table of game13578 from backend
    useEffect(() => {
        fetch(`http://localhost:3000/table/${gameId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            setTable(data);
            setLoadingTable(false);
        })
        .catch(error => {
            setErrorTable(error);
            setLoadingTable(false);
            console.error("Error fetching table:", error);
        });
    }, []);

     // Grab hand of game13578 as uid123 from backend
    useEffect(() => {
        fetch(`http://localhost:3000/hand/${gameId}/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            setHand(data.hand);
            setLoadingHand(false);
        })
        .catch(error => {
            setErrorHand(error);
            setLoadingHand(false);
            console.error("Error fetching table:", error);
        });
    }, []);
    
    const handleSubmit = () => {
        closePopup();
        // Check if all sets are valid
        const allValid = Object.values(isValidSet).every(v => v);
        const oneHasHand = Object.values(hasHandTile).some(v => v);
        const body = JSON.stringify({table: table, hand: hand});
        if (allValid && oneHasHand) {
            fetch(`http://localhost:3000/hand/${gameId}/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body
            })
            .then(response => {
                if (response.status === 201) {
                    setActivePopup("turn-successful");
                } else if (response.status === 403) {
                    setActivePopup("not-your-turn");
                } else if (response.status === 400) {
                    setActivePopup("no-more-tiles");
                } else if (!response.ok) {
                    alert(`Something went wrong! Error: ${response.status}`)
                }
                return response.json()})
            .then(data => {
                console.log("Turn submitted");
            })
            .catch(error => {
                console.error(error);
            });
        } else if (allValid) {
            setActivePopup("no-tile-moved");
        } else {
            setActivePopup("invalid-board");
        };

    };

    const drawHand = async () => {
        closePopup();
        await fetch(`http://localhost:3000/tile/${gameId}/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => {
                if (response.status === 201) {
                    setActivePopup("turn-successful");
                } else if (response.status === 403) {
                    setActivePopup("not-your-turn");
                } else if (response.status === 400) {
                    setActivePopup("no-more-tiles");
                } else if (!response.ok) {
                    alert(`Something went wrong! Error: ${response.status}`)
                }
                return response.json()})
        .then(data => {
            console.log(data);
            console.log("Turn submitted");
        })
        .catch(error => {
            console.error(error);
        });
        
    }
    
    const closePopup = () => setActivePopup(null);

    // Make a basic react component of size 1024x768 with a message in the middle saying "The game does not exist yet, I'm sorry :("
    return (
        <div>
            <div className = "game-container">
                {loadingTable ? errorTable ? "Internal Server Error" : "Loading Table..." : 
                    <div style = {containerStyleTileSet}>
                        {TileSetList.map((tileSetNum) => (
                            <TileSet key={tileSetNum} id={tileSetNum} Tiles={table[tileSetNum]} validDropRef={validDropRef} 
                            onTileChange={handleBoardTileChange} />
                        ))}
                    </div>}
                {loadingHand ? errorHand ? errorTable ? "" : "Internal Server Error" : "Loading Hand..." : 
                    <div style = {containerStyle}>
                        <HandRow key={'1'} id={'1'} HandRow={hand['1']} validDropRef={validDropRef}
                        onTileChange={handleHandTileChange} />
                        <HandRow key={'2'} id={'2'} HandRow={hand['2']} validDropRef={validDropRef}
                        onTileChange={handleHandTileChange} />
                        <HandRow key={'3'} id={'3'} HandRow={hand['3']} validDropRef={validDropRef}
                        onTileChange={handleHandTileChange} />
                    </div>
                }
                
                <ActionButton label="Give Up & Draw" onClick={() => setActivePopup("draw-card")} />
                <ActionButton label="Submit Turn" onClick={() => setActivePopup("confirm-hand")} />

                {activePopup === "draw-card" && (
                    <Popup
                        message="Are you sure you want to draw a card?"
                        onConfirm={drawHand}
                        onCancel={closePopup}
                    />
                )}

                {activePopup === "no-tile-moved" && (
                    <Popup
                        message="You haven't moved any tiles!"
                        onConfirm={closePopup}
                        onCancel={closePopup}
                    />
                )}

                {activePopup === "invalid-board" && (
                    <Popup
                        message="One of the sets on board is incomplete!"
                        onConfirm={closePopup}
                        onCancel={closePopup}
                    />
                )}

                {activePopup === "confirm-hand" && (
                    <Popup
                        message="Confirm hand?"
                        onConfirm={handleSubmit}
                        onCancel={closePopup}
                    />
                )}

                {activePopup === "not-your-turn" && (
                    <Popup
                        message="It is not your turn!"
                        onConfirm={closePopup}
                        onCancel={closePopup}
                    />
                )}

                {activePopup === "turn-successful" && (
                    <Popup
                        message="Turn successfully finished!"
                        onConfirm={closePopup}
                        onCancel={closePopup}
                    />
                )}

                {activePopup === "no-more-tiles" && (
                    <Popup
                        message="There are no more tiles in the pile!"
                        onConfirm={closePopup}
                        onCancel={closePopup}
                    />
                )}
            </div>
        </div>
    );
};