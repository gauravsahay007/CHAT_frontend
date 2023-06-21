import React from 'react'
import {useState} from "react"
import { useNavigate, Navigate } from 'react-router-dom';
import {signup} from "./Helper/APIcalls"

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
import { API } from '../../backend';

// --------------------------------------------------------
export default function Signup() {

    const [show, setShow] = useState(false);
    const [name , setName] = useState("");
    const [email, setEmail] = useState("");
    const [image,setImage]=useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const defaultTheme = createTheme();    
      const handleChange = name => event => {
        if(name==="name"){
            setName(event.target.value);
        }
        else if(name==="email"){
            setEmail(event.target.value);
        }
        else if(name==="password"){
            setPassword(event.target.value)
        }
        else{
            setImage(event.target.value)
        }
      }

      const handleSubmit = (event) => {
        event.preventDefault();
        if(!name || !email || !password){
          setShow(true);
        }
        else{
          signup({name,email,password}).then(data => {
            setSuccess(true);
            setName("");
            setEmail("");
            setPassword("");
            console.log(data);
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
          Signed Up Successfully!!
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={name}
                  name="Name"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  autoFocus
                  onChange={handleChange("name")}
                />
              </Grid>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
             
              sx={[{ mt: 3, mb: 2, bgcolor:"#32465A" },{
                '&:hover':{
                    bgcolor: "#32465A"
                }
              }]}
            onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={`/login`}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
    
      </Container>
    </div>
  )
}
