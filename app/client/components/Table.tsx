import { CSSProperties } from 'react';
import TileSet from "./TileSet";

type TableProps = {
    table: { [position: string]: string[] };
    validDropRef: React.RefObject<boolean>;
    onValidityChange: (setId: string, isValid: boolean) => void;
}

export default function Table( { table, validDropRef, onValidityChange  } : TableProps ) {
    const CurrentTable = table;
    const TileSetList = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];
    const containerStyle: CSSProperties = {
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
    // Grab first item in table and console log it to test
    return (
        <div style = {containerStyle}>
            {TileSetList.map((tileSetNum) => (
                <TileSet Tiles = { CurrentTable[tileSetNum] } validDropRef = { validDropRef } onValidityChange={onValidityChange}  />
            ))}
        </div>
    );
};

export type { TableProps };