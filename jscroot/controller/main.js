//lib call
import { insertHTML,getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
//internal call
import { url,id } from "../url/config.js";
import { getContentURL,getURLContentJS } from "../url/content.js";



const urlGetDataUser="https://api.do.my.id/data/user";

export function runAfterHashChange(evt){
    insertHTML(getContentURL(),id.content,runAfterContent);
}

export function runAfterHeader(){
    //set header and cookies
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        getJSON(urlGetDataUser,"login",getCookie("login"),getUserFunction);
    }
    insertHTML(url.template.navbar,id.navbar,runAfterNavbar);
}

async function runAfterNavbar(){
    let module = await import(url.view.navbar);
    module.main();
}

export async function runAfterContent(){
    let urljs = getURLContentJS();
    let module = await import(urljs);
    module.main();
    console.log(urljs);
}

function getUserFunction(result){
    if (result.status!==404){
        setInner("headerlogoname",result.data.name);
    }else{
        redirect("/signup");
    }
  }