import { Alert, Box, Divider, FormControl, Grid, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { fileDelete, urlDelete, urlSearchFile, urlSearchFiles, urlSearchUrl, urlSearchUrls } from "../utils";
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from "universal-cookie";

interface UrlInfo {
  addr: string,
  securityLevel: string,
  userEmail: string,
};

interface FileInfo {
  fileName: string,
  userEmail: string,
  digest: string,
}

export default function Search() {
  const [errorMessage, setErrorMessage] = useState('');
  const openErrorSnackbar = errorMessage.length > 0;
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('10');
  const [urlInfo, setUrlInfo] = useState<UrlInfo>({addr: '', securityLevel: '', userEmail: ''});
  const [urlsInfo, setUrlsInfo] = useState<Array<UrlInfo>>([]);
  const [fileInfo, setFileInfo] = useState<FileInfo>({fileName: '', userEmail: '', digest: ''});
  const [filesInfo, setFilesInfo] = useState<Array<FileInfo>>([]);
  const cookies = new Cookies();
  const realUserEmail = cookies.get("userEmail");

  const placeholder = searchType === '10' ? "Search a URL"
                    : searchType === '20' ? 'Search a file by its SHA512'
                    : searchType === '30' ? 'Search multiple URLs associated with the user email' 
                    : 'Search multiple Files associated with the user email';

  console.log(searchType);
  console.log(urlsInfo);
  console.log(fileInfo);
  console.log(filesInfo);
  console.log(urlsInfo);

  const handleSearchValueChange = (event: SelectChangeEvent) => {
    setSearchType(event.target.value);
    setUrlInfo({addr: '', securityLevel: '', userEmail: ''});
    setUrlsInfo([]);
    setFileInfo({fileName: '', userEmail: '', digest: ''});
    setFilesInfo([]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleDeleteFile = (fileInfo: FileInfo) => {
    const cookies = new Cookies();
    const AccessToken: string = cookies.get("AccessToken");
    const sendData = {
      "userEmail" : fileInfo.userEmail,
      "fileSHA512Digest" : fileInfo.digest,
    };
    let status = 200;
    fetch(fileDelete, {
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
          const tmpArray = [...filesInfo];
          if (tmpArray.length > 0) {
            const index = tmpArray.indexOf(fileInfo);
            tmpArray.splice(index, 1);
            setFilesInfo(tmpArray);
          } else {
            setFileInfo({fileName: '', userEmail: '', digest: ''});
          }
        } else {
          console.log("Error:", data);
        }
      })
      .catch((error) => {
          console.log("Error:", error);
      });
  }

  const handleDeleteUrl = (urlInfo: UrlInfo) => {
    const cookies = new Cookies();
    const AccessToken: string = cookies.get("AccessToken");
    const sendData = {
      "userEmail" : urlInfo.userEmail,
      "urlAddress" : urlInfo.addr,
    };
    let status = 200;
    fetch(urlDelete, {
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
          const tmpArray = [...urlsInfo];
          if (tmpArray.length > 0) {
            const index = tmpArray.indexOf(urlInfo);
            tmpArray.splice(index, 1);
            setUrlsInfo(tmpArray);
          } else {
            setUrlInfo({addr: '', securityLevel: '', userEmail: ''});
          }
        } else {
          console.log("Error:", data);
        }
      })
      .catch((error) => {
          console.log("Error:", error);
      });
  }
  
  const handleSearchUrl = () => {
    setUrlInfo({...urlInfo, addr: '' });
    let status = 200;
    const realUrl = urlSearchUrl + "?urlAddress=" + searchValue;
    console.log(realUrl);
    fetch(realUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", 
      },
    })
    .then((response) => {
      console.log(response.status);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        console.log("Success!");
        setUrlInfo({addr: data.addr, securityLevel: data.securityLevel, userEmail: data.userId});    
      } else {
        console.log("Error:", data);
        setErrorMessage(data.statusMessage);
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });
  }

  const handleSearchUrls = () => {
    setUrlsInfo([]);
    let status = 200;
    const realUrl = urlSearchUrls + "?userEmail=" + searchValue;
    console.log(realUrl);
    fetch(realUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", 
      },
    })
    .then((response) => {
      console.log(response.status);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (status === 200) {
        console.log("Success!");
        const tmpArray: Array<UrlInfo> = [];
        data.forEach((element: any) => {
          tmpArray.push({addr: element.addr, securityLevel: element.securityLevel, userEmail: element.userId});
        });
        setUrlsInfo(tmpArray);
      } else {
        console.log("Error:", data);
        setErrorMessage(data.statusMessage);
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });
  }

  const handleSearchFile = () => {
    let status = 200;
    const realUrl = urlSearchFile + "?fileSHA512Digest=" + searchValue;
    console.log(realUrl);
    fetch(realUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", 
      },
    })
    .then((response) => {
      console.log(response.status);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        console.log("Success!");
        setFileInfo({fileName: data.fileName, userEmail: data.userId, digest: data.digest});
      } else {
        console.log("Error:", data);
        setErrorMessage(data.statusMessage);
      }
    })
    .catch((error) => {
        console.log("Error:", error);
    });
  }

  const handleSearchFiles = () => {
    let status = 200;
    const realUrl = urlSearchFiles + "?userEmail=" + searchValue;
    console.log(realUrl);
    fetch(realUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", 
      },
    })
    .then((response) => {
      console.log(response.status);
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        console.log("Success!");
        const tmpArray: Array<FileInfo> = [];
        data.forEach((element: any) => {
          tmpArray.push({fileName: element.fileName, userEmail: element.userId, digest: element.digest});
        });
        setFilesInfo(tmpArray);
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
      direction="column"
      justifyContent="space-around"
      alignItems="center">
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100vh' }}
      >
        <FormControl sx={{width: 90}}>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchType}
            label="Search Type"
            onChange={handleSearchValueChange}
          >
            <MenuItem value={'10'}>URL</MenuItem>
            <MenuItem value={'20'}>File</MenuItem>
            <MenuItem value={'30'}>URLs</MenuItem>
            <MenuItem value={'40'}>Files</MenuItem>
          </Select>
        </FormControl>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search google maps' }}
          value={searchValue}
          onChange={handleSearchChange}
        />
        <IconButton 
          onClick={searchType === '10' ? handleSearchUrl 
                  : searchType === '20' ? handleSearchFile
                  : searchType === '30' ? handleSearchUrls
                  : handleSearchFiles} 
          type="button" sx={{ p: '10px' }} 
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {
        urlInfo.addr.length > 0 ?
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              display: 'block',
              displayPrint: 'none',
              m: 1,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            {`Address: ${urlInfo.addr}`}
            <br/>
            {`User Email: ${urlInfo.userEmail}`}
            <br/>
            {`Security Level: ${urlInfo.securityLevel}`}
            <Divider light />
          </Box>
          {
            realUserEmail === urlInfo.userEmail ?
              <IconButton 
                aria-label="delete" 
                onClick={() => {handleDeleteUrl(urlInfo);}}>
                <DeleteIcon />
              </IconButton>
            : <></>
          }
        </Grid>
        : <></>
      }

      {
        fileInfo.fileName.length > 0 ?
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              display: 'block',
              displayPrint: 'none',
              m: 1,
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            {`File Name: ${fileInfo.fileName}`}
            <br/>
            {`User Email: ${fileInfo.userEmail}`}
            <br/>
            {`File Digest: ${fileInfo.digest}`}
            <br/>
            {`Security Level: OK`}
          </Box>
          {
            realUserEmail === fileInfo.userEmail ?
              <IconButton 
                aria-label="delete" 
                onClick={() => {handleDeleteFile(fileInfo);}}>
                <DeleteIcon />
              </IconButton>
            : <></>
          }
        </Grid>
        : <></>
      }

      {
        urlsInfo.map(urlInfo => (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              sx={{
                display: 'block',
                displayPrint: 'none',
                m: 1,
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            >
              {`Address: ${urlInfo.addr}`}
              <br/>
              {`User Email: ${urlInfo.userEmail}`}
              <br/>
              {`Security Level: ${urlInfo.securityLevel}`}
              <Divider light />
            </Box>
            {
              realUserEmail === urlInfo.userEmail ?
                <IconButton 
                  aria-label="delete" 
                  onClick={() => {handleDeleteUrl(urlInfo);}}>
                  <DeleteIcon />
                </IconButton>
              : <></>
            }

          </Grid>

        ))
      }

      {
        filesInfo.map(fileInfo => (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              sx={{
                display: 'block',
                displayPrint: 'none',
                m: 1,
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            >
              {`File Name: ${fileInfo.fileName}`}
              <br/>
              {`User Email: ${fileInfo.userEmail}`}
              <br/>
              {`Security Level: OK`}
              <br/>
              <Divider light />
            </Box>
            {
              realUserEmail === fileInfo.userEmail ?
                <IconButton 
                  aria-label="delete" 
                  onClick={() => {handleDeleteFile(fileInfo);}}>
                  <DeleteIcon />
                </IconButton>
              : <></>
            }
          </Grid>
        ))
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
    </Grid>
  )
}