import React from 'react'
import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
export default function Header() {
  return (
    <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        bg="#3E103F"
        w={"100%"}
        h={"6%"}
        mb={"10px"}
        border={"2px solid white"}
      >
    <Text  style={{fontFamily:"Pacifico", fontSize:"20px"}} color={"white"} margin={"auto"} >Simple.CHAT</Text>
      </Box>
  )
}
