import { Alert, Button, Grid, IconButton, InputBase, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import Cookies from "universal-cookie";
import { googleApiKey, urlSendUrl } from "../utils";
import AddIcon from '@mui/icons-material/Add';

export default function Url() {
  const [errorMessage, setErrorMessage] = useState('');
  const openErrorSnackbar = errorMessage.length > 0;
  const [url, setUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const openSuccessSnackbar = successMessage.length > 0;
  const [infoMessage, setInfoMessage] = useState('');
  const openInfoSnackbar = infoMessage.length > 0;

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };
  
  const handleSendUrl = () => {
    const data = {
      client: {
        clientId: 'chad-virus',
        clientVersion: '0.1',
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'THREAT_TYPE_UNSPECIFIED', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['WINDOWS'],
        threatEntryTypes: ['URL'],
        threatEntries: [
          {url: url}
        ]
      }
    }
  
    let status = 200;

    console.log(JSON.stringify(data));
    fetch(googleApiKey, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      console.log(response);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      let securityLevel = 'OK';
      if (data.matches !== undefined) {
        securityLevel = data.matches[0].threatType;
      }
      const cookies = new Cookies();
      const AccessToken: string = cookies.get("AccessToken");
      const userEmail: string = cookies.get("userEmail");
      
      const sendData = {
        "userEmail" : userEmail,
        "urlAddress" : url,
        "securityLevel": securityLevel,
      };
      
      fetch(urlSendUrl, {
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
          console.log("Success!");
          if (data.includes("already")) {
            setInfoMessage("The given URL is already present in the database");
          }
          else {
            setSuccessMessage("The given URL was successfully added to the database");
          }
        } else {
          console.log("Error:", data);
          setErrorMessage(data.statusMessage);
        }
      })
      .catch((error) => {
          console.log("Error:", error);
      });
      if (status === 200) {
        console.log("Success!");
      } else {
        console.log("Error:", data);
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });
    console.log("end google");

  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center">
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Add a new URL"
          inputProps={{ 'aria-label': 'search google maps' }}
          value={url}
          onChange={handleUrlChange}
        />
        <IconButton onClick={handleSendUrl} type="button" sx={{ p: '10px' }} aria-label="search">
          <AddIcon />
        </IconButton>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openErrorSnackbar}
        onClose={() => {setErrorMessage('');}}
      >
        <Alert severity="error"> 
          {`${errorMessage}`}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSuccessSnackbar}
        onClose={() => {setSuccessMessage('');}}
      >
        <Alert severity="success"> 
          {`${successMessage}`}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openInfoSnackbar}
        onClose={() => {setInfoMessage('');}}
      >
        <Alert severity={'info'}> 
          {`${infoMessage}`}
        </Alert>
      </Snackbar>
    </Grid>
  )
}