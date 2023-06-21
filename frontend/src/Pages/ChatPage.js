import React from 'react'
import { useState } from 'react'
import SideBar from '../Components/Modals/SideBar'
import Mychats from '../Components/Mychats'
import { ChatState } from '../main/chatProvider'
import ChatBox from '../Components/ChatBox';
import { Box } from '@mui/material';

export default function ChatPage() {
    const {user} = ChatState(); 
    const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <Box sx={{ height: '100vh' , overflow: 'hidden'}}> 

        {user && <SideBar/>}

        <Box sx={{
          display:"flex",
          bgcolor:"#33455B",
         boxSizing: "content-box",
        justifyContent:"space-between" ,
        w:"100vw", 
        p:"5px"
        }}>
            {user && <Mychats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
        </Box>
    </Box>
  )
}
