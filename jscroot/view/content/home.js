import {addCSSIn,setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {id} from "../../url/config.js";


export async function main(){
    await addCSSIn("assets/css/admin.css",id.content);
    setInner("biggreet","Halo "+localStorage.getItem('nama'));
}