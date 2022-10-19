import './App.css';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Grid, Drawer, Divider, CssBaseline } from '@mui/material'
import { styled, useTheme,ThemeProvider, createTheme  } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/MoreVert';
import { Typography, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const drawerWidth = 400;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));


function App() {
  const theme = useTheme();

  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
      setDescription(json.description);
      setLoading(false);
    })
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ top: 0 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            Image Classifier UI
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={ () => { setDarkMode(!darkMode) } }color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={() => {
              setOpen(true);
            }}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '90vh' }}
        >
        <Grid item xs={3} variant="outlined" elevation={3}>
            <Box sx={{
                width: '100%',
              }}
            >
              { loading ? <CircularProgress></CircularProgress> : <img 
                src={apiUrl+'img/'+imageName}
                alt="new"
                style={{ maxHeight: '70vh', objectFit: 'contain', maxWidth: '80vh'}}
              />}
            </Box>
          </Grid>
        </Grid>
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => {
            setOpen(false);
          }}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box style={{ margin: '10px' }}>
        <Typography variant="h5">
          File Name:
        </Typography>
        <Typography variant="paragraph">
          { imageName }
        </Typography>
        <Divider />
        <Typography variant="h5">
          Description:
        </Typography>
        <Typography variant="paragraph">
          { description }
        </Typography>
        </Box>
      </Drawer>
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }} open={open}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={() => {
                setLoading(true);
                fetch(`${apiUrl}set_image?img=${imageName}&class=ok`, {
                  method: 'PUT'
                }).then((response) => {
                  console.log(response);
                  fetchNewImage()
                })
              }}
              style={{ width: '100px' }}
              variant="contained"
              color="success">
              Ok
            </Button>          
            <Box sx={{ width: '20px' }} />
            <Button
              onClick={() => {
                setLoading(true);
                fetch(`${apiUrl}set_image?img=${imageName}&class=doubt`, {
                  method: 'PUT'
                }).then((response) => {
                  console.log(response);
                  fetchNewImage()
                })
              }}
              style={{ width: '100px' }}
              variant="contained"
              color="warning">
              Doubt
            </Button>
            <Box sx={{ width: '20px' }} />
            <Button
              onClick={() => {
                setLoading(true);
                fetch(`${apiUrl}set_image?img=${imageName}&class=bad`, {
                  method: 'PUT'
                }).then((response) => {
                  console.log(response);
                  fetchNewImage()
                })
              }}
              style={{ width: '100px' }}
              variant="contained"
              color="error">
              Bad
            </Button>
          </Toolbar>
        </AppBar>
    </Box>
    </ThemeProvider>
  );
}

export default App;
