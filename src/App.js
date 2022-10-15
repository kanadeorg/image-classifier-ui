import './App.css';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';

function App() {
  const [imageName, setImageName] = useState("");
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    fetch('configs.json').then((response) => response.json())
    .then((json) => {
      console.log(json);
      setApiUrl(`http://${json.api_server_host}:${json.api_server_port}/`);
    })
  }, [])

  useEffect(() => {
    console.log(apiUrl);
    fetchNewImage()
  }, [apiUrl])

  const fetchNewImage = (callback) => {
    fetch(apiUrl + "get_image").then((response) => response.json())
    .then((json) => {
      console.log(json);
      setImageName(json.filename);
    })
  }

  return (
    <div className="App">
      <Container maxWidth="lg">
        <Box sx={{
          width: '100%',
        }}>
          <img 
            src={apiUrl+'img/'+imageName}
            alt="new"
            width="100%"
          />
        </Box>
      </Container>

      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => {
              fetch(`${apiUrl}set_image?img=${imageName}&class=ok`, {
                method: 'PUT'
              }).then((response) => {
                console.log(response);
                fetchNewImage()
              })
            }}
            variant="contained"
            color="success">
            Ok
          </Button>          
          <Box sx={{ width: '10px' }} />
          <Button
            onClick={() => {
              fetch(`${apiUrl}set_image?img=${imageName}&class=doubt`, {
                method: 'PUT'
              }).then((response) => {
                console.log(response);
                fetchNewImage()
              })
            }}
            variant="contained"
            color="warning">
            Doubt
          </Button>
          <Box sx={{ width: '10px' }} />
          <Button
            onClick={() => {
              fetch(`${apiUrl}set_image?img=${imageName}&class=bad`, {
                method: 'PUT'
              }).then((response) => {
                console.log(response);
                fetchNewImage()
              })
            }}
            variant="contained"
            color="error">
            Bad
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
