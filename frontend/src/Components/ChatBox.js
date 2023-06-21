import React from 'react'
import SingleChat from './SingleChat';
import { ChatState } from '../main/chatProvider';
import { Box } from '@mui/material';
import ScrollableFeed from 'react-scrollable-feed';
import LOGO from "../logo.png"
export default function ChatBox({fetchAgain, setFetchAgain}) {
    const {selectedChat} = ChatState();
  return (
    <>
    {selectedChat?(
   
   <Box
    sx={{display:"flex",alignItems:"center",flexDirection:"column",height:"94vh",borderRadius:"4px", width:{xs:"98%", md:"69%", lg:"69%"}, bgcolor:"#F0EEED",mt:"10px",m:{xs:"auto", md:"0px",lg:"0px"
}}}>
       
             <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

    </Box>):(<>
    <Box sx={{display:{xs:"none",md:"flex",lg:"flex"},margin:"auto"}}><img style={{ width:"35vw", border:"1px solid white", borderRadius:"4px"}} src={LOGO}/></Box>
    </>)}
    </>
  )
}
