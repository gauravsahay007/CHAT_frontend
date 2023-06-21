import React from 'react'
import {useState} from "react"
import { useNavigate, Navigate } from 'react-router-dom';
import {login} from "./Helper/APIcalls"
import { authenticate } from './Helper/APIcalls';
// --------------------------------------------------------
// Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar,Alert } from '@mui/material';
import { ChatState } from '../../main/chatProvider';
import { API } from '../../backend';

// --------------------------------------------------------
export default function Login() {
    const [show, setShow] = useState(false);
    const { setUser } = ChatState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const defaultTheme = createTheme();    
      const handleChange = name => event => {
        
        if(name==="email"){
            setEmail(event.target.value);
        }
        else {
            setPassword(event.target.value)
        }
      }

      const handleSubmit = (event) => {
        event.preventDefault();
        if(!email || !password){
          setShow(true);
          
        }
        else{  
            login({email,password}).then(data => {
              
              
              const user =   data;
              // console.log(user);

              if(user.token){
                localStorage.setItem("userInfo", JSON.stringify(data));
                setUser(data);
                setSuccess(true);
                navigate("/chats");
              }
              
            
              
  
            }
            )
        }
       
      };

      const handleClose = event => {
        setShow(false);
        setSuccess(false);
      }
    
 


  return (
    <div >
      <Snackbar open={show} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant='filled' sx={{ width: '100%' }}>
          Please fill all the fields!
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant='filled' sx={{ width: '100%' }}>
          Logined Successfully!!
        </Alert>
      </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#32465A' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
           Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={handleChange("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password" 
                  value={password}
                  onChange={handleChange("password")}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
           
         <Button fullWidth variant="filled" sx={[{color:"white", bgcolor:"#32465A",mt:"10px",mr:"5px"},{
          "&:hover":{
            bgcolor:"#32465F",
            color:"white",
            
          }
        
        }]} onClick={handleSubmit}>
              Login
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={`/signup`}>
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>

          </Box>
        </Box>
    
      </Container>
    </div>
  )
}
