import { Box } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
export default function UserBadgeItem({user,handlerfunction}) {
  return (
    <Box sx={{bgcolor:"#32465A",color:"white",borderRadius:"4px", pl:"15px", pr:"10px", pt:"5px",pb:"7px", mt:"5px", fontWeight:"500",cursor:"pointer"}} onClick={handlerfunction}>
        {user.name}
        <CloseIcon sx={{fontSize:"10px", position:"relative", top:"2px",ml:"2px"}}/>
        
    </Box>
  )
}
