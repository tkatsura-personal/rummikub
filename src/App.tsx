import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type TileProps = {
  width: number;
  height: number;
  x: number;
  y: number;
  selected: boolean;
};

function Tile({ width, height, x, y, onPointerDown, selected }: TileProps) {
  return (
    <div
      className={"tile"}
      style={{ 
        width,
        height,
        left: x, 
        top: y, 
        border: selected ? "2px solid red" : "none" 
      }}
      onPointerDown={onPointerDown}
    ></div>
  );
}

const defaultTile = {
  width: 100,
  height: 100,
  x: 200,
  y: 200
};

function App() {
  const [tileSelected, setTileSelected] = React.useState(false)
  const [tile, setTile] = React.useState(defaultTile);
  const [offset, setOffset] = React.useState<[number, number]>([0, 0]);
  const [pointer, setPointer] = React.useState<[number, number]>();

  const onPointerDown = (e) => {
    setTileSelected((b) => !b);
    const x = e.pageX - tile.x;
    const y = e.pageY - tile.y;
    setOffset([x, y]);
  }
  
  React.useEffect(() => {
    const handleMouseTrack = (e) => {
      //shift block so that block doesn't snap to top left
      const x = e.pageX - offset[0];
      const y = e.pageY - offset[1];
      setPointer([x, y]);
    }

    const handleMouseRelease = (e) => {
      if (tileSelected) {
        //Check the current tile position after the mouse is released
        console.log("check if pointer is within the page bounds");
        const rect = document.documentElement.getBoundingClientRect();
        console.log("Page bounds:", rect);
        console.log("Tile position:", tile);
        if (tile.x < rect.left || tile.x + tile.width > rect.right ||
            tile.y < rect.top || tile.y + tile.height > rect.bottom) {
          console.warn("Tile out of bounds, resetting position");
          //Snap to closest point inside the border
          setTile({
            ...tile, 
            x: Math.min(Math.max(tile.x, rect.left + 50), rect.right - (tile.width + 50)), 
            y: Math.min(Math.max(tile.y, rect.top + 50), rect.bottom - (tile.height + 50)) 
          });
        }
        setTileSelected(false);
      }
    }

    document.addEventListener("pointermove", handleMouseTrack)
    document.addEventListener("pointerup", handleMouseRelease)
    return () => {
      document.removeEventListener("pointermove", handleMouseTrack)
      document.removeEventListener("pointerup", handleMouseRelease)
    };
  }, [tileSelected]);

  React.useEffect(() => {
    if (pointer && tileSelected) {
      // Update tile position based on pointer
      //console.log("Updating tile position:", pointer);
      const [x, y] = pointer;
      setTile((t) => ({ ...t, x, y }));
    }
  }, [pointer, tileSelected]);

  return (
    <>
      <div>
        <Tile {...tile} onPointerDown={onPointerDown} selected={tileSelected} style={{ x: 200 }} />
      </div>
    </>
  )

  React.useEffect(() => {
    async function testConnection() {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        console.log(
          "✅ Firebase connected:",
          snapshot.empty ? "No docs found" : `${snapshot.size} docs found`
        );
        snapshot.forEach(doc => {
          console.log("📄 Doc:", doc.id, doc.data());
        });
      } catch (err) {
        console.error("❌ Firebase error:", err);
      }
    }
    testConnection();
  }, []);
}

export default App;