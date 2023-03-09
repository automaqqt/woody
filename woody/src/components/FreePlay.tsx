

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';

import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { calcRestTime, toColor, toDests, toGermanColor } from '../utils/helper';
import { Chess } from 'chess.js';
import { useStore } from '../utils/store';
import { fetchWrapper } from '../utils/fetch-wrapper';

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Typography } from '@mui/material';
import { defaultBoard } from '../interfaces/constants';
import { Score } from '@/interfaces/user';
import { Key } from 'chessground/types';
import AlertDialog from './modals/AlertModal';
import { Course } from '@/interfaces/training';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SuccessDialog from './modals/SuccessModal';
import Particles from 'react-tsparticles'
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import Confetti from './misc/confetti';

interface Props {
  width?: number
  config?: Config
  init_score: Score
  courses: Course[]
}

function ChessgroundWoody({
  width = 450, config = {}, init_score, courses
}: Props) {
  const [api, setApi] = useState<Api | null>(null);
  const [score, setScore] = useState(init_score);
  const [modal, setModal] = useState(false);
  const [timer, setTimer] = useState('');
  const [win, setWin] = useState(false);
  const [winReal, setWinReal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  let currentLegal = 0;
  const [currentLegalMoves, setCurrentLegalMoves] = useState(courses[score.score].moves);

  const ref = useRef<HTMLDivElement>(null);
  const chess = new Chess();
  config = { ... config, movable: {
    color: 'white',
    free: false,
    dests: toDests(chess)
  },
  highlight: {
    check: true
  }}
  useEffect(() => {
    if (ref && ref.current && !api) {
      const chessgroundApi = ChessgroundApi(ref.current, {
        animation: { enabled: true, duration: 500 },
        ...config,
      });
      setApi(chessgroundApi);
    } else if (ref && ref.current && api) {
      api.set(config);
    }
  }, [ref]);

  useEffect(() => {
    chess.load(courses[score.score].start)
    api?.set({
      fen: courses[score.score].start, ...config,
        movable: {
          color: toColor(chess),
          dests: toDests(chess),
          events: {
            after: trainPlay(api, chess, 500, false)
          }
        }
      })
    const interval = setInterval(() => {
      const newTime = dateToTimer(score)
      setTimer(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [api, config]);

  async function updateScore() {
    let newScore = score;
    newScore.score = score.score + 1;
    newScore.time_passed_in_ms = Date.now() - score.started_at
    fetchWrapper.post('api/scores/update', { newScore });
    setScore(newScore);
  }

  function trainPlay(cg: Api, chess: Chess, delay: number, firstMove: boolean) {
    return (orig: Key, dest: Key) => {

      if (calcRestTime(score) <= 0) {
        return setWin(true)
      }

      if (score.score + 1 >= courses.length) {
        return setWinReal(true)
      }

      if (score.score % 3 === 0) {
        setConfetti(true);
      }

      if (orig+dest === currentLegalMoves[currentLegal]) {
        if (currentLegal+1 >= currentLegalMoves.length) {
          updateScoreAndNextCourse(cg,chess);
        }
        else {
          chess.move({from: orig, to: dest});
          const nextFrom = currentLegalMoves[currentLegal+1].slice(0,2);
          const nextTo = currentLegalMoves[currentLegal+1].slice(2,4);
          setTimeout(() => {
            //@ts-ignore
            chess.move({from:nextFrom, to:nextTo})
            //@ts-ignore
            cg.move(nextFrom, nextTo);
            setCG(cg,chess,true);
            
            currentLegal = currentLegal+2;
          }, delay);
          }
      }
      else {
        setModal(true);
        setCG(cg,chess,true);
      }
      
    };
  }

  async function updateScoreAndNextCourse(cg: Api, chess: Chess) {
    await updateScore();
    setCurrentLegalMoves(courses[score.score].moves);
    currentLegal = 0;
    chess.load(courses[score.score].start);
    cg.set({
      fen: courses[score.score].start,
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      },
      highlight: {
        lastMove: true,
        check: true
      }
    })
    setTimeout(() => {
      //@ts-ignore
      setConfetti(false)
    }, 1500);
    
  }

  function setCG(cg: Api, chess: Chess, highlight: boolean = true) {
    cg.set({
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      },
      highlight: {
        lastMove: highlight,
        check: true
      }
    });
  }
/* 
  function showConfetti() {
    // Konfetti-Optionen
    const confettiOptions = {
      angle: 90,
      spread: 45,
      startVelocity: 40,
      elementCount: 100,
      dragFriction: 0.12,
      duration: 3000,
      stagger: 3,
      width: "10px",
      height: "10px",
      colors: ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B"]
    };
    
    // Konfetti-Animation starten
    confetti(confettiOptions);
  } */

  function dateToTimer(score:Score): string {
    const date = calcRestTime(score);

    if (date <= 0) return 'Abgelaufen!';

    const hours = Math.floor(
      (date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((date % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((date % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`
  }
  function randomInRange(min:number, max:number) {
    return Math.random() * (max - min) + min;
  }

  
  return (
    <>
      <AlertDialog
        open={modal}
        setOpen={setModal}
        text={'Probier es doch noch einmal'}
      />
      <SuccessDialog
        open={win}
        setOpen={setWin}
        text={'Die Zeit ist abgelaufen!'}
      />
      <SuccessDialog
        open={winReal}
        setOpen={setWinReal}
        text={'Du hast alle Aufgaben gelöst!'}
      />
      <Typography
            variant="h6"
            sx={{ textAlign: 'center', justifyItems:'center', marginTop: -8, marginLeft: 14,marginBottom: 5 }}
          >
            <TaskAltIcon/> {`${score.score} / ${courses.length}`}

            <AccessTimeIcon sx={{marginLeft:5, marginTop:1}}/> {timer}
      </Typography>
      <Confetti {...{fire:confetti}}/>

      <div style={{ height: width, width: width }}>
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
      </div>
    </>
    
  );
}

export default ChessgroundWoody;