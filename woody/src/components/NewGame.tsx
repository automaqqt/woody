import { Score, UserState } from '../interfaces/user';
import { Box, Typography, Button,  FormControl, ToggleButton, styled, ToggleButtonGroup } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { fetchWrapper } from '@/utils/fetch-wrapper';
import { useStore } from '@/utils/store';

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

export default function NewGame() {
  const [gameMode, setGameMode] = useState(30);
  const [next, setNext] = useState(true);
  const store = useStore();

  const router = useRouter();
  const game = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    const scoreToAdd: Score = {
      id:0,
      player_id: store.loggedInUser.id,
      player_name: store.loggedInUser.name,
      score: 0,
      time_passed_in_ms: 0,
      started_at: Date.now(),
      mode: gameMode.toString(),
    }
    const score = await fetchWrapper.post('api/scores/create', scoreToAdd);
    const newRoute = '/game?id='+score.data.id.toString()
    router.push(newRoute);
  };

  const handleDiffInputChange = (e: React.MouseEvent<HTMLElement, MouseEvent>, mode: string) => {
    setGameMode(parseInt(mode));
    
    setNext(false);
  };

    return (
      <>
    <Box
            component="form"
            noValidate
            onSubmit={game}
            sx={{ mt: '1rem', alignItems: 'center' }}
          >
            <Typography variant="h3" sx={{textAlign:'center'}} gutterBottom>
           Spielmodi
          </Typography>
          <Typography variant="h6" sx={{textAlign:'center'}} gutterBottom>
          Wie lange möchtest du üben?
          </Typography>
<FormControl sx={{justify: "center", alignItems: 'center'}}>
                
                <StyledToggleButtonGroup
                fullWidth
      orientation="vertical"
      value={gameMode}
      exclusive
      onChange={handleDiffInputChange}
      sx={{display:"block !important"}}
      
    >
      
      <ToggleButton fullWidth value="30" aria-label="Anfängerin">
       {(gameMode === 30) ? chooseTick : chooseBack} 30 Min
      </ToggleButton>
      <ToggleButton fullWidth value="60" aria-label="Fortgeschritten">
      {(gameMode === 60) ? chooseTick : chooseBack} 60 Min
      </ToggleButton>
      <ToggleButton fullWidth value="90" aria-label="Professionell">
      {(gameMode === 90) ? chooseTick : chooseBack} 90 Min
      </ToggleButton>
    </StyledToggleButtonGroup>
              </FormControl>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={next}
              sx={{ marginTop: 5, height: 80, fontSize: 23 , borderRadius: 50 }}
            >
              Weiter
            </Button>
          </Box>
    
    </>
    );
  
}
