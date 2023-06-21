import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChatState } from '../../main/chatProvider';
import { CreateGroup, SearchUsers } from '../Helper';
import { isAuthenticated } from '../Auth/Helper/APIcalls';
import UserListItem from '../Avatar/UserListItem';

// ----------------------------------------------
// Material UI
import { Typography, Grid, Snackbar, CircularProgress, Stack, Alert, Box, SxProps} from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add'; 
import { blue } from '@mui/material/colors';
import UserBadgeItem from '../Avatar/UserBadgeItem';


// ------------------------------------------------



export default function CreateGroupChat({fetchAgain, setFetchAgain}) {
// ----------------------------------------------
// dialog box
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
//   -----------------------------------------------------



// -------------------------------------------------------
// states
   const [groupChatName, setGroupChatName] = useState();
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [search, setSearch] = useState();
   const [searchResults, setSearchResults] = useState([]);
   const [loading, setLoading] = useState(false);
  const [fetch, setFetch] = useState(false);

  const {user} = ChatState();
 
   
//   console.log(user);
  
   
   
   

// -------------------------------------------------------

// -------------------------------------------------------
// handle functions

const handleSearch = (query) => {
    setSearch(query); 
    if(!query){
        return;
    } 

    try{
        setLoading(true);
        SearchUsers(user,query).then((response,err)=>{
            setSearchResults(response)
           
           setFetch(!fetch);
    
        })
    }catch(err){
        
        console.log(err);
        return;
    }
} 
useEffect(()=>{
  setTimeout(()=>{
    setLoading(false);
  },1000)
},[fetch])
const handleSubmit = () =>{
    if(!groupChatName || !selectedUsers){
        return;
    }
    try{
        CreateGroup(user,selectedUsers,groupChatName).then((response,err)=>{
            // console.log(response);
            setFetchAgain(!fetchAgain);
        })
    }
    catch(err){ 
        console.log(err);
        return ;
    }
}

const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
        <Snackbar open={open} onClose={handleClose} autoHideDuration={4000}>
        <Alert  severity="error" variant='filled' sx={{ width: '100%' }}>
          User Already Added!!
        </Alert>
      </Snackbar>
      return ;
      

    }
    else  setSelectedUsers([...selectedUsers, userToAdd]);
    
}

const handleDelete=(userToDelete)=>{
    setSelectedUsers(
        selectedUsers.filter((sel) => sel._id !== userToDelete._id)
      );
}
// -------------------------------------------------------

const sx = {
  "& .MuiDialog-container": {
    alignItems: "flex-start"
  }
};

  return (
    <div>
      <Button variant="filled" sx={[{color:"white", bgcolor:"#32465A",mt:"5px",mr:"5px"},{
        "&:hover":{
          bgcolor:"#32465F",
          color:"white",
          
        }
      
      }]} onClick={handleClickOpen}>
        Create Group <AddIcon sx={{ fontSize: 22, mb : "3px", ml : "5px", color:"white" }}/>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title"  sx={sx}
      fullWidth
    scroll="paper">
        <DialogTitle   >
        <Typography sx={{fontSize: "30px" }} variant="h5" align="center">
    Create Group Chat
</Typography>
        </DialogTitle>
        <DialogContent>
         
        <Grid item xs={12} sx={{mb:"10px", mt:"5px" }}>
                <TextField
                  required
                  fullWidth
                  size='small'
                  id="group name"
                  label="Group Name"
                  value={groupChatName}
                  onChange={(event)=>{ setGroupChatName(event.target.value)}}
                />
              </Grid>
              <Grid item xs={12} sx={{mb:"10px" , mt: "10px"}}>
                <TextField
                  required
                  fullWidth
                  size='small'
                  id="add users"
                  label="Add Users"
                  onChange={(e)=>handleSearch(e.target.value) }
                />

                <Box sx={{display:"flex", fontSize:"10px", gap:"5px"}}>
                    {selectedUsers.map((u)=>(
                        <UserBadgeItem key={u._id} user={u} handlerfunction={()=>{handleDelete(u)}}/>
                    ))}
                </Box>

            <Stack direction="row" spacing={10}>  
                <Button variant='filled'  sx={[{bgcolor:"#2C3E50", color:"white", mt:"5px"},{
                                '&:hover':{
                                  bgcolor:"#2C3E50", color:"white"
                                }
                            }]
                        } onClick={handleSubmit}>Create Chat</Button>
    {loading? (
        <div> <CircularProgress size="25px" sx={{mt:"12px"}}/></div>
                   
                  ):( <div></div> )} 
                    
            </Stack> 

            {loading? (
        <div> </div> 
                  ):(
                    searchResults
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                     
                    )))}
           
              </Grid>
        </DialogContent>
        
      </Dialog>

          

    </div>
  );
}