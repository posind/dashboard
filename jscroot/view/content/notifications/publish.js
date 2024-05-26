import { onClick,getValue,setValue,hide,show,onInput } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js";
import {validatePhoneNumber} from "https://cdn.jsdelivr.net/gh/jscroot/validate@0.0.1/croot.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
import { id, backend } from "/dashboard/jscroot/url/config.js";

export async function main(){
    await addCSSIn("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",id.content);
    onInput('phone', validatePhoneNumber);
    onClick("tombolpublishtask",actionfunctionname);
}

function actionfunctionname(){
    let lap={
        kode:getValue("kode"),
        nama:getValue("nama"),
        phone:getValue("phone"),
        solusi:getValue("solusi")
    };
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        postJSON(backend.ux.laporan,"login",getCookie("login"),lap,responseFunction);
        hide("tombolpublishtask");
    }  
}

function responseFunction(result){
    if(result.status === 200){
        const katakata = "Mohon bantuannya untuk memberikan rating dari nomor domyikado";
        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Selamat kak tugas dari "+result.data.nama+" sudah tersimpan dengan kode: "+result.data.kode,
            footer: '<a href="https://wa.me/'+result.data.phone+'?text='+katakata+'" target="_blank">Verifikasi Proyek</a>',
            didClose: () => {
                setValue("kode","");
                setValue("nama","");
                setValue("phone","");
                setValue("solusi","");
                show("tombolpublishtask");
            }
          });
    }else{
        Swal.fire({
            icon: "error",
            title: result.data.status,
            text: result.data.response
          });
          show("tombolpublishtask");
    }
    console.log(result);
}