import { GetUser } from "../Components/Helper";

export const getOtherUser=(loggedUser,users)=>{
    // console.log(users);
    if(!users || users.length < 1){
     return ;
    }
 //    if it is one to one chat then other user will be either first in the array or the second one
    if(users[0]._id==loggedUser.user._id){
        // console.log(users[1]._id);
        
        return GetUser(users[1]._id,loggedUser) ;
    }
    else {
        // console.log(users[0]._id);
      
        return GetUser(users[0]._id,loggedUser);
    }
 } 

 export const getOtherUsers = (loggedUser, users) => {
    var arr = [];
    users.forEach((user)=> {
        if(user._id  !== loggedUser._id){
            arr.push(user)
        }
    });
    return arr;
 }

//   this function is used to determine if the current message should be displayed with a different styling or formatting compared to the next message, based on the sender's identity
export const isSameSender = (messages, m, i, userId) => {
    return (i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id);
}

// this function can be used to determine if the current message is the last message in the conversation, and if it is sent by a different user than the userId, indicating that it may require a different styling
 export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length -1 &&
         messages[messages.length - 1].sender._id !== userId && messages[messages.length - 1].sender._id
    )
 }

export const isSameSenderMargin = (messages, m, i, userId) => {
    if(
        i<messages.length-1 && messages[i+1].sender._id === m.sender._id && messages[i].sender._id !== userId
    ){
        return 1;
    }

    else if(
        (i<messages.length-1 && messages[i+1].sender._id !== m.sender._id && messages[i].sender._id !== userId) ||( i === messages.length-1 && messages[i].sender._id !== userId )
    ){
        return 0;
    }

    else return "auto";
}


export const isSameUser = (messages, m ,i) => {
    return i > 0 && messages[i-1].sender._id === m.sender._id;
} 
