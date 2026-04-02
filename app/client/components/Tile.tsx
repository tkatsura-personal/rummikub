import { CSSProperties } from "react";
import React from "react";
import { useState } from "react";

interface TileProps {
  id: string;
  numCol: string;
  onChildRemove: Function;
  onBoard: string;
}

export default function Tile({ id, numCol, onChildRemove, onBoard }: TileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startBoard = onBoard;
  const color = numCol.length > 1? numCol[0] : "K";
  const number = numCol.length > 1? numCol.slice(1) : '\u{263A}';

  const colorDictionary: Record<string, string> = { 
    'K': 'black', 
    'U': 'blue', 
    'R': 'red', 
    'O': 'orange' 
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("drag-item-id", id);
    e.dataTransfer.setData("drag-item-value", numCol);
    e.dataTransfer.setData("drag-item-board", startBoard);
    setTimeout(() => setIsDragging(true), 0);
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
  if (e.dataTransfer.dropEffect === "none") {
    // If drop effect does not exist, do nothing
  } else {
    onChildRemove(e, id); // If a drop effect exists, remove the tile from the original 
  }
  setIsDragging(false);
};

  const containerStyle: CSSProperties = { 
    display: 'grid',
    placeItems: 'center',
    fontSize: '40px',
    color: colorDictionary[color],
    background: "lightgray", 
    position: 'relative', 
    width: 60, 
    height: 90,
    border: startBoard === "true"? '1px solid gray' : '1px solid lightgreen',
    boxSizing: 'border-box',
    margin: "4px",
    opacity: isDragging ? 0 : 1,
    lineHeight: 1,
    padding: 0
  }
  

  return (
    <div draggable="true" onDragStart={handleDragStart} onDragEnd={handleDragEnd} style={containerStyle}>
      <div>{number}</div>
      <div style={{fontSize: '24px'}}>{'\u{2B24}'}</div>
    </div>
  );
}

export type { TileProps };