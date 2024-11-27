import {
  getValue,
  onInput,
} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js";
import { validatePhoneNumber } from "https://cdn.jsdelivr.net/gh/jscroot/validate@0.0.2/croot.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { deleteJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { putJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "/dashboard/jscroot/url/config.js";
import { loadScript } from "../../../controller/main.js";
import { truncateText, addRevealTextListeners } from "../../utils.js";
  
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
      backend.project.faq,
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
      backend.project.faq,
      "login",
      getCookie("login"),
      getResponseFunction
    );
  }
  
  function getResponseFunction(result) {
    const tableBody = document.getElementById("webhook-table-body-faq");
    if (tableBody) {
      if (result.status === 200) {
        tableBody.innerHTML = ""; // Clear table body content
        if ($.fn.DataTable.isDataTable("#myTable")) {
          $("#myTable").DataTable().destroy();
        }
  
        result.data.forEach((faq) => {
          const truncatedDescription = truncateText(faq.answer, 50);
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${faq.question}</td>
            <td class="has-text-justified">
            ${truncatedDescription}
            <span class="full-text" style="display:none;">${faq.answer}</span>
          </td>
            <td class="has-text-centered">
              <button class="button is-danger removeFAQButton" data-id="${faq._id}">
                <i class="bx bx-trash"></i>
              </button>
              <button class="button is-warning editFAQButton" data-id="${faq._id}" data-question="${faq.question}" data-answer="${faq.answer}">
                <i class="bx bx-edit"></i>
              </button>
            </td>
          `;
          tableBody.appendChild(row);
        });
  
        dataTable = $("#myTable").DataTable({
          processing: true,
          serverSide: true,
          ajax: function (data, callback, settings) {
            // Ambil nilai pencarian dari input DataTables
            const searchValue = data.search.value;
        
            // Tentukan limit dan offset berdasarkan DataTables
            const limit = data.length; // Jumlah data per halaman
            const offset = data.start; // Data mulai dari indeks ke-
        
            // Buat URL dengan parameter pencarian, limit, dan offset
            const url = `${backend.project.faq}?search=${searchValue}&limit=${limit}&offset=${offset}`;
        
            fetch(url, {
              method: "GET",
              headers: {
                login: getCookie("login"),
              },
            })
              .then((response) => response.json())
              .then((result) => {
                if (result.status === 200) {
                  // Kirim data ke DataTables
                  callback({
                    draw: data.draw,
                    recordsTotal: result.total, // Total semua data di database
                    recordsFiltered: result.filtered, // Total data yang sesuai pencarian
                    data: result.data, // Data yang ditampilkan
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: result.data.status,
                    text: result.data.response,
                  });
                }
              })
              .catch((error) => console.error("Error fetching data:", error));
          },
          columns: [
            { data: "question" },
            { data: "answer" },
            {
              data: null,
              render: function (data) {
                return `
                  <button class="button is-danger removeFAQButton" data-id="${data._id}">
                    <i class="bx bx-trash"></i>
                  </button>
                  <button class="button is-warning editFAQButton" data-id="${data._id}" data-question="${data.question}" data-answer="${data.answer}">
                    <i class="bx bx-edit"></i>
                  </button>
                `;
              },
            },
          ],
        });
        

        addRevealTextListeners();
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
      console.error('Element with ID "webhook-table-body-faq" not found.');
    }
  }

  // Add project event listener
  document.getElementById("addButtonFaq").addEventListener("click", () => {
    Swal.fire({
      title: "Tambah FAQ",
      html: `
              <div class="field">
                  <label class="label">Question</label>
                  <div class="control">
                      <textarea class="textarea" type="text" id="question" placeholder="Tulis pertanyaan"></textarea>
                  </div>
              </div>
              <div class="field">
                  <label class="label">Answer</label>
                  <div class="control">
                      <textarea class="textarea" id="answer" placeholder="Tulis jawaban"></textarea>
                  </div>
              </div>
          `,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const question = Swal.getPopup().querySelector("#question").value;
        const answer= Swal.getPopup().querySelector("#answer").value;
  
        if (!question || !answer) {
          Swal.showValidationMessage(`Please enter all fields`);
        } else {
          return {
            question: question,
            answer: answer,
          };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let resultData = {
          question: getValue("question"),
          answer: getValue("answer"),
        };
        if (getCookie("login") === "") {
          redirect("../");
        } else {
          postJSON(
            backend.project.faq,
            "login",
            getCookie("login"),
            resultData,
            responseFunction
          );
        }
      }
    });
  });
  
  
  function responseFunction(result) {
    if (result.status === 200) {
      const katakata = "Pembuatan FAQ baru " + result.data._id;
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "Selamat kak barang " +
          result.data.faq +
          " sudah terdaftar dengan ID: " +
          result.data._id,
        footer:
          '<a href="https://wa.me/62895800006000?text=' +
          katakata +
          '" target="_blank">Verifikasi FAQ</a>',
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
    console.log(result);
  }
  
  function addRemoveFAQButtonListeners() {
    document.querySelectorAll(".removeFAQButton").forEach((button) => {
      button.addEventListener("click", async () => {
        const question = button.getAttribute("data-question");
  
        const result = await Swal.fire({
          title: "Delete this FAQ?",
          text: "You cannot undo this action!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete FAQ",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const faqWillBeDeleted = {
            question: question,
          };
  
          deleteJSON(
            backend.project.faq,
            "login",
            getCookie("login"),
            faqWillBeDeleted,
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
          const {  } = formValues;
          const updatedFaq = {
            _id: faqId,
            question: question,
            answer: answer,
          };
          putJSON(
            backend.project.faq, // Assumes a POST method will handle updates as well
            "login",
            getCookie("login"),
            updatedFaq,
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
        text: `FAQ ${result.data.question} has been updated successfully.`,
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
    console.log(result);
  }
  