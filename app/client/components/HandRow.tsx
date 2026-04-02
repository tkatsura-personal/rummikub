import { CSSProperties } from "react";
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tile from "./Tile";

type HandRowProps = {
    id: string;
    HandRow: string[];
    validDropRef: React.RefObject<boolean>;
    onTileChange: (setId: string, tileList: string[]) => void;
}

export default function HandRow( { id, HandRow, validDropRef, onTileChange }: HandRowProps ) {
    const validLocation = useRef(true);
    const [HandList, setHandTiles] = useState(() =>
        HandRow?.length > 0? (
            HandRow.map(tile => ({ id: uuidv4(), value: tile, onBoard: "false" }))
        ) : (
            ([])
        )
    );

    const containerStyle: CSSProperties = {
        overflowX: 'scroll',
        display: 'flex',
        flexDirection: 'row',
        flex: '0 0 100%',
        position: 'relative',
        border: '1px solid black',
        boxSizing: 'border-box',
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
        const droppedTileBoard = e.dataTransfer.getData("drag-item-board");
        if (HandList.filter(t => t.id == droppedTileId)?.length == 0 && droppedTileBoard == "false") {
            setHandTiles(prev => [ ...prev, {id: droppedTileId, value: droppedTileValue, onBoard: droppedTileBoard}])
            validDropRef.current = true;
        } else {
            validDropRef.current = false;
        }
    };

    const handleTileRemove = (e: React.DragEvent, tileId: string) => {
        e.preventDefault();
        const dropSuccess = validDropRef.current;
        if (dropSuccess) {
            setHandTiles(prev => prev.filter(t => t.id !== tileId));
            validDropRef.current = false;
        }
    }

    useEffect(() => {
            // Grab Tile List 
            const TilesShort = HandList.map(tileData => tileData.value);
            onTileChange(id , TilesShort);
        }, [HandList]);
    
    return (
        HandList?.length > 0 ? (
            <div style={containerStyle} onDragOver={handleDragOver} onDrop={handleDrop}>
                {HandList.map((tile) => (
                    <Tile key={tile.id} id={tile.id} numCol={tile.value} onChildRemove={handleTileRemove} onBoard={tile.onBoard}/>
                ))}
            </div>
        ) : (
            <div style={containerStyle} onDragOver={handleDragOver} onDrop={handleDrop}></div>
        )
    );
    
};

export type { HandRowProps };