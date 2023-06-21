import React from 'react'
import { Box, Avatar, Stack, Typography } from '@mui/material'
export default function UserListItem({user, handleFunction}) {

  return (
    <Box onClick={handleFunction} sx={[{bgcolor:"#E8E8E8",mt:"5px",mb:"5px",borderRadius:1 , p:"5px", display:"flex" , gap:"20px",cursor:"pointer"},{
        '&:hover':{
            bgcolor:"#2C3E50",
            color:"white"
        }
    }]}>
        <Avatar sx={{  width: 38, height: 38, border:"1px solid black" }} src={user.pic}/>
    <Box sx={{display:"flex", flexDirection:"column"}}>
        <Typography>{user.name}</Typography>
        <Typography  >{user.email}</Typography>
    </Box>
   
    </Box>
  )
}
