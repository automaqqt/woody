import { Container, Box, Button, CircularProgress } from '@mui/material';
import { useWindowSize } from '../utils/helper';
import { useStore } from '../utils/store';
import { useRouter } from 'next/router';
import BackButton from '../components/button/BackButton';
import { fetchWrapper } from '../utils/fetch-wrapper';
import ChessgroundWoody from '../components/FreePlay';
import { Score } from '@/interfaces/user';
import useSWR from 'swr';
import axios from 'axios';
import { Course } from '@/interfaces/training';
import DropsTable from '@/components/tables/DropsTable';

function HighScore() {

  const router = useRouter();
  
    return (
      <>
        <BackButton {...{
        onClick:() => router.back(),
        buttonText:'< Zurück'
        }}/>
    <Container sx={{mt:10}}>
      <DropsTable/>
    </Container>
      </>
    )
  
}

export default HighScore;
