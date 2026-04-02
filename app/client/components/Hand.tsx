import { CSSProperties } from 'react';
import HandRow from "./HandRow";

type HandProps = {
    hand: { [position: string]: string[] };
    validDropRef: React.RefObject<boolean>;
}

export default function Hand( { hand, validDropRef }: HandProps ) {
    const CurrentHand = hand;
    const containerStyle: CSSProperties = {
        position: 'relative',
        border: '1px solid black',
        display: 'flex',
        flexWrap: 'wrap',
        width: '80%',
        height: '45%',
    }
    // Grab first item in Hand and console log it to test
    return (
        <div style = {containerStyle}>
            <HandRow HandRow = { CurrentHand['1'] } validDropRef = { validDropRef } />
            <HandRow HandRow = { CurrentHand['2'] } validDropRef = { validDropRef } />
            <HandRow HandRow = { CurrentHand['3'] } validDropRef = { validDropRef } />
        </div>
    );
};

export type { HandProps };