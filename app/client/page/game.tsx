'use client';
// React imports
import React from "react";
import { useState } from "react";
//import components
import HandRow from "../components/HandRow";
import TableSet from "../components/TableSet";
import Tile from "../components/Tile";




export default function game() {
    // Grab table of game13578 from backend
    const [table, setTable] = useState([]);
    const [hand, setHand] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [loadingHand, setLoadingHand] = useState(true);
    const [errorTable, setErrorTable] = useState(null);
    const [errorHand, setErrorHand] = useState(null);

    fetch("http://localhost:3000/table/game13578", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => {
        setTable(data);
        setLoadingTable(false);
        console.log("Table data:", data);
    })
    .catch(error => {
        setErrorTable(error);
        setLoadingTable(false);
        console.error("Error fetching table:", error);
    });

     // Grab hand of game13578 as uid123 from backend
    fetch("http://localhost:3000/hand/game13578/uid123", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => {
        setHand(data);
        setLoadingHand(false);
        console.log("Hand data:", data);
    })
    .catch(error => {
        setErrorHand(error);
        setLoadingHand(false);
        console.error("Error fetching table:", error);
    });

    


    // Make a basic react component of size 1024x768 with a message in the middle saying "The game does not exist yet, I'm sorry :("
    return (
        <div>
            <h3>The game does not exist yet, I'm sorry :&#40;</h3>
            {loadingTable ? "Loading..." : JSON.stringify(table)}
            {errorTable && <p>Error: {errorTable.message}</p>}
            {loadingHand ? "Loading..." : JSON.stringify(hand)}
            {errorHand && <p>Error: {errorHand.message}</p>}
        </div>
    );
};