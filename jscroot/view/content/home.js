import {
  addCSSIn,setValue,
  setInner,addChild 
} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.8/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { getJSON,putJSON  } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { id, backend } from "../../url/config.js";

let tableTemplate=`
<td width="5%"><i class="fa fa-bell-o"></i></td>
<td>#TASKNAME#</td>
<td class="level-right">
<button class="button is-small is-primary" data-item="#TASKID#">Ambil</button>
</td>
`

export async function main() {
  await addCSSIn("assets/css/admin.css", id.content);
  getJSON(backend.user.data, "login", getCookie("login"), getUserFunction);
  getJSON(backend.user.todo, "login", getCookie("login"), getUserTaskFunction);
  getJSON(backend.user.doing, "login", getCookie("login"), getUserDoingFunction);
}

function getUserFunction(result) {
  if (result.status !== 404) {
    const roundedPoin = Math.round(result.data.poin);
    setInner("biggreet", "Halo " + result.data.name);
    setInner(
      "subtitle",
      "Jumlah rollup sprint point kamu saat ini sebesar " + roundedPoin + " poin."
    );
  } else {
    redirect("/signup");
  }
}

function getUserTaskFunction(result) {
  if (result.status === 200) {
    setInner('list',"");
    console.log(result.data);
    result.data.forEach(isiTaskList);
  }
}

function isiTaskList(value){
  let content=tableTemplate.replace("#TASKNAME#",value.task)
        .replace("#TASKID#",value._id);
  console.log(content);
  console.log(value);
  addChild("list","tr","",content);
  // Jalankan logika tambahan setelah addChild
  runAfterAddChild(value);
}

function runAfterAddChild(value) {
  // Temukan elemen tr yang baru saja ditambahkan
  const rows = document.getElementById("list").getElementsByTagName("tr");
  const lastRow = rows[rows.length - 1];

  // Contoh: Tambahkan event listener atau manipulasi DOM lainnya
  const button = lastRow.querySelector('.button');
  if (button) {
      button.addEventListener('click', () => {
        putJSON(backend.user.doing, "login", getCookie("login"), {_id:value._id},putTaskFunction);
      });
  }

  console.log("Additional scripts run for row:", lastRow);
}

function putTaskFunction(result){
  if (result.status === 200) {
    getJSON(backend.user.todo, "login", getCookie("login"), getUserTaskFunction);
    getJSON(backend.user.doing, "login", getCookie("login"), getUserDoingFunction);
  }
}

function getUserDoingFunction(result){
  if (result.status === 200) {
  setValue('doneinput',result.data.task);
  }
}