import { API } from "../backend";
import { useNavigate } from "react-router-dom";
export const CreateGroup = (data,users,name) => {
    return fetch(`${API}/create/groupChat/${data.user._id}`,{
        method:"POST",
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`
        },
        body:JSON.stringify({name,users})
    }).then(resp=>{
        return resp.json() ;
    })
}


export const SearchUsers = (data,search) => {
    // console.log(data);
    return fetch(`${API}/${data.user._id}?search=${search}`,{
        method:"GET",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${data.token}`
     }   }).then(response=>{
        
        return response.json();
    })
}

export const FetchChats = (data) => {
  
   return (data?(fetch(`${API}/fetch/chats/${data.user._id}`,{
    method:"GET",
    headers:{
        Accept: "application/json",
        "Content-Type":"application/json",
        Authorization: `Bearer ${data.token}`
 } }).then((response)=>{
    // console.log(response);
    return response.json();
 })):( null)) 
}

export const RenameGroup = (data, chatName, chatId) =>{
    return fetch(`${API}/rename/group`,{
        method:"PUT",
    headers:{
        Accept: "application/json",
        "Content-Type":"application/json",
        Authorization: `Bearer ${data.token}`
 } ,
 body:JSON.stringify(
   
    {chatName,chatId}
 )
    }).then(resp=>{
        return resp.json()
    })
}

export const Kickout = (data, chatId, userId) => {
   
    return fetch(`${API}/kickOut`,{
        method:"PUT",
    headers:{
        Accept: "application/json",
        "Content-Type":"application/json",
        Authorization: `Bearer ${data.token}`
 } ,
 body:JSON.stringify({ 
    "userId" : userId,
    "chatId" : chatId
 })
    })
}

export const AddToGroup = (data,chatId,userId) => {
    return fetch(`${API}/addto/group`,{
        method:"PUT",
    headers:{
        Accept: "application/json",
        "Content-Type":"application/json",
        Authorization: `Bearer ${data.token}`
 } ,
 body:JSON.stringify(
   
    {chatId,userId}
 )
    })
}

export const FetchMessages = (data, user) => {
   
    return (data?(fetch(`${API}/${data._id}/allmessage`,{
        method:"GET",
        headers:{ 
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
     } }).then((response)=>{
        return response.json();
     })):( null))
}


export const RemoveNotification = (chatId,data) => {
    
    const userId = data.user._id;
    return fetch(`${API}/deletenotification`,{
        method: "PUT",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${data.token}`
        },
        body:JSON.stringify({userId,chatId})
    }).then(response=>{
        return response.json();
    })
}

export const SendMessage = (user,ChatId,content) =>{
    return fetch(`${API}/message/send/${user.user._id}`,{
        method: "POST",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
        },
        body:JSON.stringify({ChatId,content})  
    }).then(response=>{
    //    console.log(response);
        return response.json();
    })
}


export const AccessChats = (user,userId,name) => {
    return fetch(`${API}/access/chat/${user.user._id}`,{
        method: "POST",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
        },
        body:JSON.stringify({userId,name})  
    }).then(response=>{
        return response.json();
    }) 
}

export const GetUser = (data,user) =>{
    return fetch(`${API}/user/${data}`,{
        method:"GET",
        headers:{ 
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
     } }).then((response)=>{
        return response.json();
     })
}


export const SendNotification = (user,data) =>{
    return fetch(`${API}/storenotification`,{
        method:"PUT",
        headers:{ 
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
     },
    body:JSON.stringify(data.userId,data.messageId, data.chatId) }).then((response)=>{
        return response.json();
     })
}

