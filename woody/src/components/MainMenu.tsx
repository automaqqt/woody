import { Score, UserState } from '../interfaces/user';
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings';
import { Fab, Box, Container, Typography, Button, CssBaseline, FormControl, ToggleButton, styled, ToggleButtonGroup } from '@mui/material';
import { useRouter } from 'next/router';
import GreenButton from './button/GenericButton';
import BackButton from './button/BackButton';
import { useStore } from '../utils/store';
import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import NewGame from './NewGame';
import { fetchWrapper } from '@/utils/fetch-wrapper';
import { calcRestTime } from '@/utils/helper';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    width: '95vw',
    color: 'white',
    background: '#575757',
    paddingLeft: 40,
    fontSize: 20,
    margin: 25,
    borderRadius: 100,
    [theme.breakpoints.up('sm')]: {
      width: '50vw',
    },
    '&.Mui-disabled': {
      border: 0,
    },
    '&.Mui-selected': {
      background: '#3D703A !important',
    },
    '&:not(:first-of-type)': {
      borderRadius:100
    },
    '&:first-of-type': {
      borderRadius: 100
    },
  },
}));

const chooseBack = <div style={{position: 'absolute',
width: '35px',
height: '35px',
left: '19px',
top: '11px',
borderRadius: 100,
background: '#FAF4E7'}}></div>

const chooseTick = <div style={{position: 'absolute',
width: '35px',
height: '35px',
left: '19px',
top: '11px',
borderRadius: 100,
background: '#FAF4E7'}}> <CheckIcon sx={{color:'black', mt: 0.7}}/></div>

export default function MainMenu() {
  const {
    loggedInUser,
    setLoggedInState,
  } = useStore();
  const [choosing, setChoosing] = useState('No');

  const router = useRouter();
  const choose = async () => {
    const scores: Score[] = await fetchWrapper.get('api/scores/all');
    console.log(scores)
    
    const filtered_scores = scores.filter((score) => score.player_id === loggedInUser.id)
    filtered_scores.forEach(score => {
      if ((calcRestTime(score) > 0) && score.score < 6) {
        const newRoute = '/game?id='+score.id.toString()
        router.push(newRoute);
      }
    })
    setChoosing('Yes');
  };
  
  const bestenliste = () => {
    router.push('/highscore');
  };
  const logout = () => {
    setLoggedInState({
      id: 0,
      name: 'None'
    });
    router.push('/');
  };

  
  if (choosing === 'No') {
    return (
      <>
      <BackButton {...{
        onClick:logout,
        buttonText:'Abmelden',
        color:'#FF0000'
        }}/>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
  
          <Box
            sx={{
              marginTop: '10rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h3" component="h1" sx={{mb:5}} gutterBottom>
              Hallo {loggedInUser.name}
            </Typography>
            
            <GreenButton {...{buttonText:"Runde starten", onClick:choose}}/>
            <GreenButton {...{buttonText:"bestenliste", onClick:bestenliste, color:'#575757'}}/>  
  
          </Box>
        </Container>
      </>
    );
  } else {
    return ( <NewGame/>
    );
  }
  
}
