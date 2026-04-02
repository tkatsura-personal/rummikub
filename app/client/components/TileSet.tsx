import { CSSProperties } from 'react';
import { useState, useEffect, useRef } from 'react';
import Tile from "./Tile";
import { v4 as uuidv4 } from 'uuid';

interface TileSetProps {
    id: string;
    Tiles: string[];
    validDropRef: React.RefObject<boolean>;
    onTileChange: (setId: string, tileList: string[], hasHandile: boolean, isValid: boolean) => void;
}

function checkSet(Tiles: string[]) {
    if (Tiles?.length === 0) {
        return true;
    } else if (Tiles?.length < 3) {
        return false;
    }

    const getColor  = (tile: string) => tile[0];
    const getNumber = (tile: string) => parseInt(tile.slice(1));

    // Rule 3: First two tiles share the same number → treat as a "group"
    if (getNumber(Tiles[0]) === getNumber(Tiles[1])) {
        const colors = Tiles.map(getColor);
        const uniqueColors = new Set(colors);
        // All colors must be different (no duplicates)
        return uniqueColors.size === Tiles.length;

    // Rule 4: First two tiles have different numbers → treat as a "run"
    } else {
        const numbers = Tiles.map(getNumber);
        const colors = Tiles.map(getColor);
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] !== numbers[i - 1] + 1 || colors[i] !== colors[0]) return false;
        }
        return true;
    }
}

export default function TileSet( { id, Tiles, validDropRef, onTileChange }: TileSetProps ) {
    const validLocation = useRef(true);
    const [TilesList, setTiles] = useState(() => 
        Tiles?.length > 0? (
            Tiles.map(tile => ({ id: uuidv4(), value: tile, onBoard: "true" }))
        ) : (
            ([])
        )
    );
    const [isValidSet, setisValidSet] = useState(true);
    
    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        flex: '0 0 50%',
        position: 'relative',
        border: isValidSet? '1px solid lightgreen': '1px solid red',
        backgroundColor: isValidSet? 'transparent': 'rgba(255, 0, 0, 0.5)',
        boxSizing: "border-box",
        minHeight: '90px'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        validLocation.current = true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedTileId = e.dataTransfer.getData("drag-item-id");
        const droppedTileValue = e.dataTransfer.getData("drag-item-value");
        const droppedTileBoard = e.dataTransfer.getData("drag-item-board"); // Won't be used but need to read for future setData's
        if (TilesList.filter(t => t.id == droppedTileId)?.length == 0) {
            setTiles(prev => [ ...prev, {id: droppedTileId, value: droppedTileValue, onBoard: droppedTileBoard }]
                .sort((a, b) => parseInt(a.value.slice(1)) - parseInt(b.value.slice(1))));
            validDropRef.current = true;
        } else {
            setTiles(prev => prev.filter(t => t.id !== droppedTileId));
            setTiles(prev => [ ...prev, {id: droppedTileId, value: droppedTileValue, onBoard: droppedTileBoard }]
                .sort((a, b) => parseInt(a.value.slice(1)) - parseInt(b.value.slice(1))));
            validDropRef.current = false;
        }
    };

    const handleTileRemove = (e: React.DragEvent, tileId: string) => {
        e.preventDefault();
        const dropSuccess = validDropRef.current;
        if (dropSuccess) {
            setTiles(prev => prev.filter(t => t.id !== tileId));
            validDropRef.current = false;
        }
    }

    useEffect(() => {
        // Grab Tile List 
        const TilesShort = TilesList.map(tileData => tileData.value);
        const hasHandTile = TilesList.some(tileData => tileData.onBoard === 'false');
        const valid = checkSet(TilesShort);
        setisValidSet(valid);
        onTileChange(id , TilesShort, hasHandTile, valid);
    }, [TilesList]);

    return (
        TilesList?.length > 0 ? (
            <div style ={containerStyle} onDragOver={handleDragOver} onDrop={handleDrop}>
                {TilesList.map((tile) => (
                    <Tile key={tile.id} id={tile.id} numCol={tile.value} onChildRemove={handleTileRemove} onBoard={tile.onBoard}/>
                ))}
            </div>
        ) : (
            <div style={containerStyle} onDragOver={handleDragOver} onDrop={handleDrop}></div>
        )
    );
};

export type { TileSetProps };