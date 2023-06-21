import {API} from "../../../backend"


export const login = (user) => {
    
    return fetch(`${API}/login`,{
        method:"POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(resp => {
        return resp.json();
    })
    .catch(err => {return err })
}

export const signup = (user) => {
    return fetch(`${API}/signup`,{
        method:"POST",
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)

    }).then((resp,err)=>{
        if(err){
            return ;
        }
        else return resp.json();
    }).
    catch(err=>{
        console.log(err);
        return
    })
}

export const authenticate = (data, next) =>{
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt",JSON.stringify(data))

        next();
    }
}

export const isAuthenticated = () => {
    if(typeof window == "undefined"){
        return false
    }
    if(localStorage.getItem("jwt")){
        
        return JSON.parse(localStorage.getItem("jwt"));
        
    }
    else{
        return false    }
}