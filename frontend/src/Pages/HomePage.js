import React from 'react';
import LOGO from '../logo.png';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  
  const onClick=()=>{
    console.log(user);
    if(user){
      navigate("/chats");
    }
    else{
      navigate("/login")
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#33455B',
        overflow: 'hidden',
      }}
    >
      <img
        style={{ border: '1px solid white', width: '60vw', height: 'auto' }}
        src={LOGO}
        alt="Logo"
      />

      <Button
        
        variant="filled"
        sx={{
          bgcolor:"#00A884",
          color: 'white',
          mt: '10px',
          mr: '5px',
          '&:hover': {
            bgcolor: '#00A884',
            color: 'white'
          },
        }}
        onClick={onClick}
      >
        Get Started
      </Button>
    </Box>
  );
}
