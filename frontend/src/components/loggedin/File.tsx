import { useState } from "react";
import { Alert, Button, Grid, Snackbar } from "@mui/material";
import FileUpload from 'react-material-file-upload';
import { urlSendFile } from "../utils";
import Cookies from "universal-cookie";

export default function File() {
  const [files, setFiles] = useState<File[]>([]);
  const isFile = files.length > 0;
  const [errorMessage, setErrorMessage] = useState('');
  const openErrorSnackbar = errorMessage.length > 0;
  const [successMessage, setSuccessMessage] = useState('');
  const openSuccessSnackbar = successMessage.length > 0;
  const [infoMessage, setInfoMessage] = useState('');
  const openInfoSnackbar = infoMessage.length > 0;

  const handleSendFile = () => {
    files[0].text().then((data) => {
      let utf8Encoder = new TextEncoder();
      const binDataEncoded = utf8Encoder.encode(data);
      const binData: Array<number> = [];
      binDataEncoded.forEach((data) => {
        binData.push(data);
      });

      const cookies = new Cookies();
      const AccessToken: string = cookies.get("AccessToken");
      const userEmail: string = cookies.get("userEmail");
      
      const sendData = {
        "userEmail" : userEmail,
        "binData" : binData,
        "fileName" : files[0].name,
      };
      
      let status = 200;
      console.log(sendData);
      console.log(JSON.stringify(sendData));
      
      fetch(urlSendFile, {
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
          console.log(data);
          console.log("Success!");
          if (data.includes("already")) {
            setInfoMessage("The given file is already present in the database");
          }
          else {
            setSuccessMessage("The given file was successfully added to the database");
          }        
        } else {
          console.log("Error:", data);
          setErrorMessage(data.statusMessage);
        }
      })
      .catch((error) => {
          console.log("Error:", error);
      });
    });
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center">
      
      <FileUpload 
        sx={{m: 2}}
        value={files}
        onChange={setFiles}
        buttonText="Upload File"
        title="Drag and drop a file or click on the button below to upload a file"
      />
      {isFile ? 
        <Button
          onClick={handleSendFile}
          >Send File
        </Button>
        : <></>
      }
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
        <Alert severity={'success'}> 
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