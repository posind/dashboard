import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
import { id,backend } from "/dashboard/jscroot/url/config.js";

export async function main(){
    await addCSSIn("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",id.content);
    getJSON(backend.project.data,'login',getCookie('login'),getResponseFunction);
}

function getResponseFunction(result){
    console.log(result);
    if (result.status===200){
        // Menambahkan baris untuk setiap webhook dalam data JSON
        result.data.forEach(webhook => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${webhook.name}</td>
                <td>${webhook.secret}</td>
                <td>https://api.do.my.id/webhook/[github/gitlab]/${webhook.name}</td>
                <td>${webhook.description}</td>
            `;
            getElementById('webhook-table-body').appendChild(row);
        });

    }else{
        Swal.fire({
            icon: "error",
            title: result.data.status,
            text: result.data.response
          });
    }
}