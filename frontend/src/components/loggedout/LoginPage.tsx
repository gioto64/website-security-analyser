import React from 'react';
import {Alert, Button, Checkbox, FormControlLabel, Grid, Snackbar, TextField} from '@mui/material'
import { urlLogin } from '../utils';
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [checked, setChecked] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  const openErrorSnackbar = errorMessage.length > 0;

  const sendForm = () => {
    const data = {
      "userEmail": email,
      "password": password,
    };

    console.log(JSON.stringify(data));

    let status = 200;

    fetch(urlLogin, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", 
      },
      body: JSON.stringify(data),   
    })
    .then((response) => {
      console.log(response);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        console.log("Success!");
        const cookies = new Cookies();
        if (checked) {
          cookies.set('AccessToken', data.AccessToken, {path: '/', sameSite: 'strict', maxAge: 2592000});
          cookies.set('userEmail', email, {path: '/', sameSite: 'strict', maxAge: 2592000});
        } else {
          cookies.set('AccessToken', data.AccessToken, {path: '/', sameSite: 'strict'});
          cookies.set('userEmail', email, {path: '/', sameSite: 'strict'});  
        }
        navigate("/files");
        navigate(0);
      } else {
        console.log("Error:", data);
        setErrorMessage(data.statusMessage);
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });
  }

  return (
    <Grid
      container
      spacing={3}
      direction={'column'}
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '70vh' }}
    >
      <Grid item xs={12}>
      <TextField 
          label="Email" 
          type={'email'} 
          value={email}
          onChange={handleEmailChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          label="Password" 
          type={'password'} 
          value={password}
          onChange={handlePasswordChange}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          }
          label="Keep me logged in"
        />
      </Grid>
      <Grid 
        item xs={12}
        onClick={sendForm}
      >
        <Button fullWidth > 
          Login 
        </Button>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openErrorSnackbar}
        onClose={() => {setErrorMessage('');}}
      >
        <Alert severity="error"> 
          {`${errorMessage}`}
        </Alert>
      </Snackbar>
    </Grid>
  );
}