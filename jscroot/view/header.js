import { backend } from "../url/config.js";

export function main(){
    //set header and cookies
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        getJSON(backend.user.data,"login",getCookie("login"),getUserFunction);
    }
}


function getUserFunction(result){
    if (result.status!==404){
        setInner("headerlogoname",result.data.name);
    }else{
        redirect("/signup");
    }
}