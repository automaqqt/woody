import * as React from 'react';
import {Button, TextField, Box, styled  } from '@mui/material';
import { useStore } from '../utils/store';
import { User } from '../interfaces/user';
import { fetchWrapper } from '../utils/fetch-wrapper';
import { useRouter } from 'next/router';

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 20,
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 20,
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 6,
    borderRadius: 20,
    padding: '4px !important', // override inline-style
  },
});

export default function SignIn() {
  const { setLoggedInState } = useStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const usersRepo: User[] = await fetchWrapper.get('api/users/all');
    // @ts-ignore
    const name = data.get('name').toString();

    if (
      usersRepo
        .flatMap((user) => user.name)
        // @ts-ignore
        .includes(data.get('name').toString())
    ) {
      setLoggedInState(
        usersRepo.filter((user) => user.name === name)[0]
      );
    } 
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <ValidationTextField
              margin="normal"
              fullWidth
              id="name"
              label="Dein Name"
              name="name"
              autoComplete="name"
              autoFocus
              sx={{mb:5}}
            />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, height: 100, fontSize: 30, borderRadius:25 }}
        >
          Anmelden
        </Button>
      </Box>
    </>
  );
}
