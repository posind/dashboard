import {
  addCSSIn,
  setInner,addChild 
} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { id, backend } from "../../url/config.js";

export async function main() {
  await addCSSIn("assets/css/admin.css", id.content);
  getJSON(backend.user.data, "login", getCookie("login"), getUserFunction);
  getJSON(backend.user.task, "login", getCookie("login"), getUserTaskFunction);
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
  console.log(value);
  addChild("list","li","",value.task);
}