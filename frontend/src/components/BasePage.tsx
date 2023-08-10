import { CssBaseline, Grid, ThemeProvider, createTheme } from "@mui/material";
import Cookies from "universal-cookie";
import Header from "./header/Header";
import LoggedInPage from "./loggedin/LoggedInPage";
import UnregisteredPage from "./loggedout/UnregisteredPage";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function BasePage() {
  const cookie = new Cookies();
  const accessToken = cookie.get("AccessToken");
  console.log(accessToken);
  const isLoggedIn = accessToken !== undefined;

  const route = useLocation();
  console.log(route);
  const isProfile = route.pathname === '/profile';

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid>
        <Header isLoggedIn={isLoggedIn}/>
        {!isLoggedIn ?
          <UnregisteredPage />
        : !isProfile ?
            <LoggedInPage />
        : <Outlet/>
        }
      </Grid>
    </ThemeProvider>

  )
}

