
import { useState } from 'react';
import { Box, Container, CssBaseline, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/router';
import GreenButton from '../components/button/GenericButton';
import SignIn from '@/components/SignIn';
import { useStore } from '@/utils/store';
import MainMenu from '@/components/MainMenu';

import logo from '../../public/wood.png';

function IndexPage() {

  const store = useStore();
  const [landing, setLanding] = useState('land');

  const login = () => {
    setLanding('login');
  };

  if (store.loggedInUser.name === 'None') {
    if (landing==='login') {
      return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
          <Box
            sx={{
              marginTop: '5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          > 
            <SignIn/>
          </Box>
      </Container>)
    }
    
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        ><Link href="/">
        <Image
          src={logo}
          alt="logo by ben "
          width={350}
          height={300}
          style={{ marginBottom: 50 }}
        />
      </Link> 
        <Typography variant="h3" component="h1" sx={{mb:5, fontFamily:'Anton'}} gutterBottom>
        Woody der wooder
      </Typography>
          
          <Divider sx={{mb:5}} />
          <GreenButton {...{buttonText: 'Anmelden', onClick:login}}/>
        </Box>
      </Container>
    );
  } else {
    return <MainMenu/>;
  }
  
    
    
}

export default IndexPage;
