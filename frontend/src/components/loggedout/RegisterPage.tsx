import React from 'react';
import {Alert, Button, Grid, Snackbar, TextField} from '@mui/material'
import { urlRegister } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSetSuccessMessage } from './UnregisteredPage';

export default function RegisterPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secondPassword, setSecondPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const setSuccessMessage = useSetSuccessMessage();
  
  const navigate = useNavigate();

  const openErrorSnackbar = errorMessage.length > 0;
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSecondPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecondPassword(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const sendForm = () => {
    if (secondPassword !== password) {
      setErrorMessage("[Error] Passwords must match");
      return;
    }
    const data = {
      "userEmail": email,
      "username": username,
      "password": password,
      "name": name,
      "desc": ""
    };

    console.log(JSON.stringify(data));

    let status = 200;

    fetch(urlRegister, {
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
        console.log("Success:", data);
        setSuccessMessage(data);
        navigate("/login");
      } else {
        console.log("Error:", data);
        setErrorMessage(data.statusMessage);
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });;
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
          required
          label="Email" 
          type={'email'} 
          value={email}
          onChange={handleEmailChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          required
          label="Username" 
          value={username}
          onChange={handleUsernameChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required 
          label="Password" 
          type={'password'} 
          value={password}
          onChange={handlePasswordChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required 
          label="Confirm Password" 
          type={'password'} 
          value={secondPassword}
          onChange={handleSecondPasswordChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Name (optional)" 
          type={'name'} 
          value={name}
          onChange={handleNameChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button 
          fullWidth
          onClick={sendForm}
        > 
          Register 
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