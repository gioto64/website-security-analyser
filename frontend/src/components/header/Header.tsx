import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

interface ButtonAppBarProps {
  isLoggedIn: boolean,
};

export default function ButtonAppBar(props: ButtonAppBarProps) {
  const navigate = useNavigate();
  
  const handleOnClickLogin = () => {
    navigate("/login");
  };

  const handleOnClickRegister = () => {
    navigate("/register");
  }

  const handleOnClickLogout = () => {
    const cookies = new Cookies();
    cookies.remove("AccessToken");
    navigate("/");
    navigate(0);
  };

  const handleOnHomePress = () => {
    if (props.isLoggedIn) {
      navigate("/files");
    } else {
      navigate("/");
    }
  }

  const handleOnClickProfile = () => {
    navigate("/profile");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" onClick={handleOnHomePress}>Home</Button>
          </Typography>
          {!props.isLoggedIn 
            ? 
              <>  
                <Button color="inherit" onClick={handleOnClickLogin}>Login</Button>
                <Button color="inherit" onClick={handleOnClickRegister}>Register</Button>
              </>
            : <>
                <Button color="inherit" onClick={handleOnClickProfile}>Profile</Button>
                <Button color="inherit" onClick={handleOnClickLogout}>Logout</Button>
              </>
            }
        </Toolbar>
      </AppBar>
    </Box>
  );
}