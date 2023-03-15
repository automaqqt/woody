

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
import { Button, Typography } from '@mui/material';
import { defaultBoard } from '../interfaces/constants';
import { Score } from '@/interfaces/user';
import { Key } from 'chessground/types';
import AlertDialog from './modals/AlertModal';
import { Course } from '@/interfaces/training';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SuccessDialog from './modals/SuccessModal';
import Confetti from './misc/confetti';
import TopSmallActionButton from './button/TopButton';

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
  const [skip, setSkip] = useState(0);
  let currentLegal= 0;
  const [currentLegalMoves, setCurrentLegalMoves] = useState(courses[score.score+skip].moves);

  const ref = useRef<HTMLDivElement>(null);
  const chess = new Chess();
  config = { ... config, 
    turnColor: (courses[score.score+skip].start.split(' ')[1] === 'w') ? 'white' : 'black',
    movable: {
    color: 'white',
    free: false,
    dests: toDests(chess)
  },
  highlight: {
    check: true
  }}
  const skipCourse = () => {
    setSkip(skip+1);
  };
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
    setCurrentLegalMoves(courses[score.score+skip].moves);
    
  }, [skip]);

  useEffect(() => {
    chess.load(courses[score.score+skip].start)
    api?.set({
      fen: courses[score.score+skip].start, ...config,
        movable: {
          color: toColor(chess),
          dests: toDests(chess),
          events: {
            after: trainPlay(api, chess, 1000, false)
          }
        }
      })

    const interval = setInterval(() => {
      const newTime = dateToTimer(score)
      setTimer(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [api, score, currentLegalMoves, skip]);

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

      

      console.log(orig+dest,currentLegal, currentLegalMoves[currentLegal])

      if (orig+dest === currentLegalMoves[currentLegal]) {

        

        if (currentLegal+1 >= currentLegalMoves.length) {
          if (score.score % 1 === 0 && score.score != 0) {
            setConfetti(true);
            setTimeout(() => {
              setConfetti(false)
              
            }, 400);
          }          
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
        cg.move(dest, orig);
        setCG(cg,chess,true);
      }
      
    };
  }
  async function updateScoreAndNextCourse(cg: Api, chess: Chess) {
    await updateScore();
    setCurrentLegalMoves(courses[score.score+skip].moves);
    currentLegal=0;
    chess.load(courses[score.score+skip].start);
    cg.set({
      fen: courses[score.score+skip].start,
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      },
      highlight: {
        lastMove: false,
        check: true
      }
    })    
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
      <Button
      variant="contained"
      aria-label={'hi'}
      sx={{ float:'right', marginTop:-9, backgroundColor: '#FF0000' }}
      onClick={skipCourse}
    >
      {'Überspringen >'}
    </Button>
      <Typography
            variant="h6"
            sx={{ textAlign: 'center', justifyItems:'center', marginBottom:1 }}
          >
            <TaskAltIcon/> {`${score.score} / ${courses.length}`}

            <AccessTimeIcon sx={{marginLeft:5, marginTop:1}}/> {timer}
            
      </Typography>
      
      <Confetti {...{fire:confetti}}/>

      <div style={{ height: width, width: width }}>
        <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
      </div>
      Am Zug: {toGermanColor(api?.state.turnColor)}
    </>
    
  );
}

export default ChessgroundWoody;