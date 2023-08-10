import { Button, Grid, IconButton } from "@mui/material";
import Cookies from "universal-cookie";
import { deleteAccount } from "../utils";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Profile() {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    const cookies = new Cookies();
    const AccessToken: string = cookies.get("AccessToken");
    const userEmail: string = cookies.get("userEmail");
    let status = 200;
    const sendData = {
      "userEmail" : userEmail,
    };

    fetch(deleteAccount, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'AccessToken': AccessToken,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", 
      },
      body: JSON.stringify(sendData), 
    })
    .then((response) => {
      console.log(response.status);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        cookies.remove("AccessToken");
        cookies.remove("userEmail");
        navigate("/");
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });
  };

  return (
    <Grid  
      container
      spacing={3}
      sx={{p: 10}}
      direction={'column'}
      justifyContent="center"
      alignItems="center"
    >
      <br/>
      <Button 
        variant="outlined" 
        color="error"
        onClick={handleDeleteAccount}
      >
        DELETE ACCOUNT
      </Button>
      <IconButton 
        aria-label="delete"
        href="https://dlang.org/"
      >
        <DeleteIcon />
      </IconButton>
    </Grid>
  );
}