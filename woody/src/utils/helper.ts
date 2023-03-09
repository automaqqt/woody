import { useEffect, useState } from "react";
import { Course } from '../interfaces/training';
import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
import { SQUARES, Chess, Move } from 'chess.js';
import { Score } from "@/interfaces/user";

interface windowSize {
    width: number;
    height: number;
  }
  

export function useWindowSize(): windowSize {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<windowSize>({
      width: 0,
      height: 0
    });
  
    useEffect(() => {
      // only execute all the code below in client side
  
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
  
      // Add event listener
      window.addEventListener('resize', handleResize);
  
      // Call handler right away so state gets updated with initial window size
      handleResize();
  
      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }


export function toDests(chess: Chess): Map<Key, Key[]> {
    const dests = new Map();
    SQUARES.forEach(s => {
      const ms = chess.moves({square: s, verbose: true});
      if (ms.length) dests.set(s, ms.map(m => (typeof m === 'string') ? m : m.to));
    });
    return dests;
  }
  
  export function toColor(chess: Chess): Color {
    return (chess.turn() === 'w') ? 'white' : 'black';
  }
  
  export function toGermanColor(turn: string | undefined): string {
    return (turn === 'white') ? 'weiß' : 'schwarz';
  }
  
  export function playOtherSide(cg: Api, chess: Chess) {
    return (orig: Key, dest: Key) => {
      chess.move({from: orig, to: dest});
      cg.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        }
      });
    };
  }
  
  export function calcRestTime(score:Score): number {
    return (parseInt(score.mode)*60*1000)-(Date.now() - score.started_at);
  }