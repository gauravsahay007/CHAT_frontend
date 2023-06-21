import { API } from "./backend"

export const RemoveNotification = (user,chatId) =>{
    const id= user.user._id;
    return fetch(`${API}/deletenotification`,

    {
      method:"PUT",
      headers:{
          Accept: "application/json",
          "Content-Type":"application/json",
          Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({id,chatId}),
  }).then((response)=>{
    return response.json();
  }).catch(err=>{
    return null;
  })
}


export const GetNotification = (user) =>{
    return  fetch(`${API}/getnotification/${user.user._id}`,{
        method:"GET",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>{
        console.log(err);
    })
}


export const sendNotification = (user,userId,chatId,messageId) =>{
    return fetch(`${API}/storenotification`,{
        method:"PUT",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({userId,chatId,messageId}) 

    }).then(response=>{
        return response.json();
    }).catch(err=>{
        console.log(err);
    })
}