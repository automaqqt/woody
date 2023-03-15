import { Container, Box, Button, CircularProgress } from '@mui/material';
import { useWindowSize } from '../utils/helper';
import { useStore } from '../utils/store';
import { useRouter } from 'next/router';
import TopSmallActionButton from '../components/button/TopButton';
import { fetchWrapper } from '../utils/fetch-wrapper';
import ChessgroundWoody from '../components/FreePlay';
import { Score } from '@/interfaces/user';
import useSWR from 'swr';
import axios from 'axios';
import { Course } from '@/interfaces/training';

function WoodPlay() {
  const router = useRouter();
  const size = useWindowSize();

  console.log('hi')
  let width = size.width * 0.9;
  if (size.height < size.width) {
    width = size.height * 0.85;
  }

  const { id } = router.query;

  console.log(id)
  const { data: courses } = useSWR<Course[]>(
    ['api/courses/all'],
    (url) => axios.get(url).then((res) => res.data)
  );

  const { data: score } = useSWR<Score>(
    ['api/scores/get_by_id?id='+id],
    (url) => axios.get(url).then((res) => res.data)
  );
  if (!courses || !score){
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      </Container>
    );
  }
  
  else {
    console.log(score)
    return (
      <>
        <TopSmallActionButton {...{
        onClick:() => router.back(),
        buttonText:'< Zurück'
        }}/>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            
            <ChessgroundWoody
            width={width}
            config={{
              draggable: {enabled:false},
              
            }}
            init_score={score as Score}
            courses={courses}/>
          </Box>
        </Container>
        
      </>
    )
  }
  
}

export default WoodPlay;
