import { Grid, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';

export default function LoggedInPage() {
  const route = useLocation();
  console.log(route);
  const [value, setValue] = useState(
    route.pathname === "/urls" ? 1
    : route.pathname === "/search" ? 2
    : 0
  );
  const navigate = useNavigate();
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFilesChange = () => {
    navigate("/files");
  };

  const handleUrlChange = () => {
    navigate("/urls");
  };

  const handleSearchChange = () => {
    navigate("/search");
  };

  return (
    <Grid  
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        <Tab onClick={handleFilesChange} icon={<LinkIcon />} iconPosition="end" label="Files" />
        <Tab onClick={handleUrlChange} icon={<FileUploadIcon />} iconPosition="end" label="URL" />
        <Tab onClick={handleSearchChange} icon={<SearchIcon />} iconPosition="end" label="Search" />
      </Tabs>
      <Outlet />
    </Grid>  
  )
}