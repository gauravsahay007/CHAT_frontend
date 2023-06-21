import React from "react";
import { useState,useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';



import {IconButton ,Avatar,Button,Typography ,Box,Dialog,DialogContent,DialogTitle } from "@mui/material";
import { ChatState } from "../../main/chatProvider";
import { GetUser } from "../Helper";

const ProfileModal = ({ users,children, size }) => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

      const {selectedChat, setSelectedChat} = ChatState();
    
    const [otherUser, setOtherUser] = useState();
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

   var user={};
    if(users.users[0]._id===loggedUser.user._id){
      // console.log(users[0].users);
      user=(users.users[1]);
      // co                               nsole.log(user);
    //
   }
    else{
      // console.log(users);
      // console.log(users.users);
      user=(users.users[0]);
      // console.log(user);
    }

 
    // console.log(object);
    // console.log(ChatState())


  

  
    return (
      <>
        {children ? (
          <span onClick={handleClickOpen}>
            {children}
          </span>
        ) : (
          <>
            <IconButton
              sx={{
                display: { base: 'flex' },
                background: 'inherit',
                borderRadius: '90%',
              }}
              onClick={handleClickOpen}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  size={size}
                  cursor="pointer"
                  alt={user.name}
                  src={user.pic}
                />
                <Typography sx={{ ml: '10px' , color:"white"}}>{user.name}</Typography>
                
              </Box>
            </IconButton>
          </>
        )}
    
        <Dialog open={open} maxWidth="lg">
          <DialogTitle sx={{ fontSize: 40, fontFamily: 'QuickSand', textAlign: 'center' }}>
             {user.name}
          </DialogTitle>
          <DialogContent>
            <Box textAlign="center">
              <Avatar sx={{ width: 90, height: 90, m: 'auto', mb: '20px' }} src={user.pic} />
            </Box>
            <Typography align="center">Email: {user.email}</Typography>
          </DialogContent>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </Dialog>
      </>
    );
    
    
  
    
  };

  
  export default ProfileModal;