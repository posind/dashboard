import {
    getValue,
    onInput,
  } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js";
  import { postJSON, deleteJSON, putJSON, getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
  import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
  import { addCSSIn } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
  import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
  import { id, backend } from "/dashboard/jscroot/url/config.js";
  import { loadScript } from "../../../controller/main.js";
  
  let dataTable;
  
  export async function main() {
    await addCSSIn(
      "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",
      id.content
    );
    await addCSSIn("assets/css/custom.css", id.content);
    await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
    await loadScript("https://cdn.datatables.net/2.0.8/js/dataTables.min.js");
  
    getJSON(
      backend.faq.data,
      "login",
      getCookie("login"),
      getResponseFunction
    );
  }
  
  function reloadDataTable() {
    if (dataTable) {
      dataTable.destroy(); // Destroy the existing DataTable
    }
    getJSON(
      backend.faq.data,
      "login",
      getCookie("login"),
      getResponseFunction
    );
  }
  
  function getResponseFunction(result) {
    const tableBody = document.getElementById("webhook-table-body");
    if (tableBody) {
      if (result.status === 200) {
        tableBody.innerHTML = ""; // Clear table body content
        if ($.fn.DataTable.isDataTable("#myTable")) {
          $("#myTable").DataTable().destroy();
        }
  
        result.data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.question}</td>
            <td>${item.answer}</td>
            <td class="has-text-centered">
              <button class="button is-danger removeFAQButton" data-id="${item._id}">
                <i class="bx bx-trash"></i>
              </button>
              <button class="button is-warning editFAQButton" data-id="${item._id}" data-question="${item.question}" data-answer="${item.answer}">
                <i class="bx bx-edit"></i>
              </button>
            </td>
          `;
          tableBody.appendChild(row);
        });
  
        dataTable = $("#myTable").DataTable({
          responsive: true,
          autoWidth: false,
        });
  
        addRemoveFAQButtonListeners();
        addEditFAQButtonListeners();
      } else {
        Swal.fire({
          icon: "error",
          title: result.data.status,
          text: result.data.response,
        });
      }
    } else {
      console.error('Element with ID "webhook-table-body" not found.');
    }
  }
  
  function addRemoveFAQButtonListeners() {
    document.querySelectorAll(".removeFAQButton").forEach((button) => {
      button.addEventListener("click", async () => {
        const faqId = button.getAttribute("data-id");
  
        const result = await Swal.fire({
          title: "Delete this FAQ?",
          text: "You cannot undo this action!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete FAQ",
          cancelButtonText: "Cancel",
        });
  
        if (result.isConfirmed) {
          deleteJSON(
            backend.faq.data,
            "login",
            getCookie("login"),
            { id: faqId },
            removeFAQResponse
          );
        }
      });
    });
  }
  
  function removeFAQResponse(result) {
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "FAQ has been removed.",
        didClose: () => {
          reloadDataTable();
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: result.data.status,
        text: result.data.response,
      });
    }
  }
  
  function addEditFAQButtonListeners() {
    document.querySelectorAll(".editFAQButton").forEach((button) => {
      button.addEventListener("click", async () => {
        const faqId = button.getAttribute("data-id");
        const question = button.getAttribute("data-question");
        const answer = button.getAttribute("data-answer");
  
        const { value: formValues } = await Swal.fire({
          title: "Edit FAQ",
          html: `
            <div class="field">
              <label class="label">Question</label>
              <textarea class="textarea" id="question">${question}</textarea>
            </div>
            <div class="field">
              <label class="label">Answer</label>
              <textarea class="textarea" id="answer">${answer}</textarea>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            const question = Swal.getPopup().querySelector("#question").value;
            const answer = Swal.getPopup().querySelector("#answer").value;
            if (!question || !answer) {
              Swal.showValidationMessage(`Please enter all fields`);
            }
            return { question, answer };
          },
        });
  
        if (formValues) {
          putJSON(
            backend.faq.data,
            "login",
            getCookie("login"),
            { id: faqId, ...formValues },
            updateFAQResponse
          );
        }
      });
    });
  }
  
  function updateFAQResponse(result) {
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "FAQ has been updated successfully.",
        didClose: () => {
          reloadDataTable();
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: result.data.status,
        text: result.data.response,
      });
    }
  }
  