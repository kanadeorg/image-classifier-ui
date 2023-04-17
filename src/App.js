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
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const drawerWidth = 200;

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

const DisplayWindow = (props) => {
  return (
    <>
      { props.loading ? <CircularProgress></CircularProgress> : ( props.mode === 'photo' ? <img 
          src={props.apiUrl+'img/'+props.imageName}
          alt="new"
          style={{ maxHeight: '70vh', objectFit: 'contain', maxWidth: '100%'}}
        /> : <audio src={props.apiUrl+'audio/'+props.audioName} controls loop="true" autoplay="true"></audio>)}
    </>
  )
}

function App() {
  const theme = useTheme();

  const [imageName, setImageName] = useState("");
  const [audioName, setAudioName] = useState("");
  const [description, setDescription] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [mode, setMode] = useState("photo");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch('configs.json').then((response) => response.json())
    .then((json) => {
      // setApiUrl(`https://${json.api_server_host}:${json.web_server_port}/api/`);
      setApiUrl(`https://playground.uotca.com/api/`);
      setTranslate(json.translate)
    })
  }, [])

  useEffect(() => {
    if (mode === "photo")
      fetchNewImage()
    else
      fetchNewAudio()
  }, [apiUrl, mode])

  const saveChange = (cla, name) => {
    setLoading(true);
    const url = mode === 'photo' ? 'set_image?img=' : 'set_audio?audio=';
    fetch(`${apiUrl}${url}${name}&class=${cla}`, {
      method: 'PUT'
    }).then((response) => {
      if (mode === 'photo')
        fetchNewImage();
      else
        fetchNewAudio();
    });
  }

  const fetchNewImage = (callback) => {
    fetch(apiUrl + "get_image").then((response) => response.json())
    .then((json) => {
      setImageName(json.filename);
      setDescription(json.description);
      if (json.translatedText) {
        setTranslatedText(json.translatedText);
      }
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      setDone(true);
    })
  }

  const fetchNewAudio = (callback) => {
    fetch(apiUrl + "get_audio").then((response) => response.json())
    .then((json) => {
      setAudioName(json.filename);
      setDescription(json.description);
      if (json.translatedText) {
        setTranslatedText(json.translatedText);
      }
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      setDone(true);
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
            { mode === "photo" ? "Image Classifier UI" : "Audio Classifier UI"}
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={ () => { setDarkMode(!darkMode) } }color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton sx={{ ml: 1 }} onClick={ () => { setDone(false); setLoading(true); setMode(mode === "photo" ? "audio" : "photo") } }color="inherit">
            {mode === "photo" ? <InsertPhotoIcon /> : <AudiotrackIcon  />}
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
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '90vh' }}
        >
        <Grid item xs={3}>
            { done ?
              <Typography variant='h5'>谢谢，当前分类任务已完成。点击右上角按钮切换模式看看别的数据集吧。</Typography> : 
              <DisplayWindow mode={mode} loading={loading} apiUrl={apiUrl} imageName={imageName} audioName={audioName}></DisplayWindow>
            }

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
        {translate ? <>
            <Divider />
            <Typography variant="h5">标签翻译:</Typography>
            <Typography variant="paragraph">
              {translatedText}
            </Typography></> : null}
        </Box>
      </Drawer>
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }} open={open}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={() => {
                setLoading(true);
                saveChange('ok', mode === "photo" ? imageName : audioName);
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
                saveChange('doubt', mode === "photo" ? imageName : audioName);
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
                saveChange('bad', mode === "photo" ? imageName : audioName);
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
