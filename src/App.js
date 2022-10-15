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
  const [doneClassification, setDoneClassification] = useState(false);

  useEffect(() => {
    fetch('configs.json').then((response) => response.json())
    .then((json) => {
      console.log(json);
      setApiUrl(`http://${json.api_server_host}:${json.api_server_port}/`);
    })
  }, [])

  useEffect(() => {
    console.log(apiUrl);
    fetch(apiUrl + "get_image").then((response) => response.json())
    .then((json) => {
      console.log(json);
      setImageName(json.filename);
      setDoneClassification(false);
    })
  }, [apiUrl, doneClassification])

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
              fetch(`${apiUrl}set_image?img=${imageName}&class=good`, {
                method: 'PUT'
              }).then((response) => {
                console.log(response);
                setDoneClassification(true)
              })
            }}
            variant="contained"
            color="success">
            Looks Good!
          </Button>
          <Box sx={{ width: '10px' }} />
          <Button
            onClick={() => {
              fetch(`${apiUrl}set_image?img=${imageName}&class=bad`, {
                method: 'PUT'
              }).then((response) => {
                console.log(response);
                setDoneClassification(true)
              })
            }}
            variant="contained"
            color="error">
            Not Good X
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
