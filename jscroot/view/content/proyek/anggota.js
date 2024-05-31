import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "/dashboard/jscroot/url/config.js";
import { loadScript } from "../../../controller/main";

export async function main() {
  await addCSSIn(
    "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",
    id.content
  );

  await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  await loadScript("https://cdn.datatables.net/2.0.8/js/dataTables.min.js");

  getJSON(
    backend.project.anggota,
    "login",
    getCookie("login"),
    getResponseFunction
  );

  document.addEventListener("DOMContentLoaded", () => {
    (document.querySelectorAll(".notification .delete") || []).forEach(
      ($delete) => {
        const $notification = $delete.parentNode;
        $delete.addEventListener("click", () => {
          $notification.parentNode.removeChild($notification);
        });
      }
    );
  });
}

function getResponseFunction(result) {
  console.log(result);
  if (result.status === 200) {
    // Menambahkan baris untuk setiap webhook dalam data JSON
    result.data.forEach((webhook) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${webhook.name}</td>
                <td>${webhook.secret}</td>
                <td>https://api.do.my.id/webhook/[githost]/${webhook.name}</td>
                <td>${webhook.description}</td>
            `;
      document.getElementById("webhook-table-body").appendChild(row);
    });

    $(document).ready(function () {
      $("#myTable").DataTable({
        responsive: true,
      });
    });
  } else {
    Swal.fire({
      icon: "error",
      title: result.data.status,
      text: result.data.response,
    });
  }
}