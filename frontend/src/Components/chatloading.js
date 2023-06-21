//The Stack component is used to stack multiple components vertically or horizontally.
import { Stack } from "@mui/material";
//The Skeleton component is used to create loading placeholders.
import {Skeleton} from "@mui/material";
import React from "react";
const ChatLoading=()=>{
    return(
        <Stack>
            {/* //variant prop set to "rect", which means it will be a rectangular loading placeholder. */}
            <Skeleton variant="rect" sx={{height:'50px'}}/>
        </Stack>
    )
}
export default ChatLoading;