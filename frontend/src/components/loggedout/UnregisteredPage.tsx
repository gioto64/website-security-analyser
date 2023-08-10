import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Search from "../loggedin/Search";

export default function UnregisteredPage() {
  const [succesMessage, setSuccessMessage] = useState('');
  const openSuccessSnackbar = succesMessage.length > 0;
  
  const route = useLocation();
  const searchOpen = route.pathname === '/';

  return (
    <div>
      <br/>
      <Outlet context={setSuccessMessage}/>
      {searchOpen ? 
        <Search /> : <></>
      }
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSuccessSnackbar}
        onClose={() => {setSuccessMessage('');}}
      >
        <Alert severity="success"> 
          {`${succesMessage}`}
        </Alert>
      </Snackbar>
    </div>
  )
}

export function useSetSuccessMessage() {
  return useOutletContext<React.Dispatch<React.SetStateAction<string>>>();
}