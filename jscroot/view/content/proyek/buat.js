import { onClick,getValue,disableInput,hide,show } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.6/croot.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
import { id, backend } from "/dashboard/jscroot/url/config.js";

export async function main(){
    document.getElementById('name').addEventListener('input', function(event) {
        event.target.value = processInput(event.target.value);
      });
    await addCSSIn("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",id.content);
    onClick("tombolbuatproyek",actionfunctionname);
}

function actionfunctionname(){
    let project={
        name:getValue("name"),
        description:getValue("description")
    };
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        postJSON(backend.project.data,"login",getCookie("login"),project,responseFunction);
        hide("tombolbuatproyek");
    }  
}

function responseFunction(result){
    if(result.status === 200){
        const katakata = "Pembuatan proyek baru "+result.data._id;
        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Selamat kak proyek "+result.data.name+" sudah terdaftar dengan ID: "+result.data._id+" dan Secret: "+result.data.secret,
            footer: '<a href="https://wa.me/62895601060000?text='+katakata+'" target="_blank">Verifikasi Proyek</a>',
            didClose: () => {
                disableInput("name");
                disableInput("description");
            }
          });
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.error
          });
          show("tombolbuatproyek");
    }
    console.log(result);
}


function processInput(value) {
    value = value.toLowerCase(); // Convert to lowercase
    value = value.replace(/\s+/g, ''); // Remove spaces
    value = value.replace(/[^a-z0-9_-]/gi, ''); // Remove special characters except _ and -
    return value;
}