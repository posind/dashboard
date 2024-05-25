import {addCSSIn,setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {id,backend} from "../../url/config.js";

export async function main(){
    await addCSSIn("assets/css/admin.css",id.content);
    getJSON(backend.user.data,"login",getCookie("login"),getUserFunction);
    
}

function getUserFunction(result){
    if (result.status!==404){
        setInner("biggreet","Halo "+result.data.name);
    }else{
        redirect("/signup");
    }
}