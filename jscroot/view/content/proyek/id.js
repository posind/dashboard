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
      backend.project.id,
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
      backend.project.id,
      "login",
      getCookie("login"),
      getResponseFunction
    );
  }
  
  function getResponseFunction(result) {
    console.log(result);
    const tableBody = document.getElementById("webhook-table-body");
    if (tableBody) {
      if (result.status === 200) {
        // Clear existing table body content to avoid duplication
        tableBody.innerHTML = "";
  
        // Destroy existing DataTable instance if it exists
        if ($.fn.DataTable.isDataTable("#myTable")) {
          $("#myTable").DataTable().destroy();
        }
  
        // Menambahkan baris untuk setiap webhook dalam data JSON
        result.data.forEach((barang) => {
          const truncatedDescription = truncateText(barang.barang_terlarang, 50);
  
          // Gabungkan nama anggota dalam satu kolom dengan numbering dan tambahkan tombol Add Member
        //   let membersHtml =
        //     project.members && project.members.length > 0
        //       ? project.members
        //           .map(
        //             (member, index) =>
        //               `
        //               <div class="tag is-success mb-3">
        //                  ${index + 1}. ${member.name}
        //                 <button class="delete is-small removeMemberButton" data-project-name="${
        //                   project.name
        //                 }" data-member-phonenumber="${
        //                 member.phonenumber
        //               }"></button>
        //               </div>
        //             `
        //           )
        //           .join("<br>") // Tambahkan <br> untuk membuat baris baru untuk setiap anggota
        //       : "";
        //   membersHtml += `
        //     <button class="button box is-primary is-small btn-flex addMemberButton" data-project-id="${project._id}">
        //       <i class="bx bx-plus"></i>
        //       Add member
        //     </button>`;
  
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${barang.destinasi}</td>
            <td class="has-text-justified">
              ${truncatedDescription}
              <span class="full-text" style="display:none;">${barang.barang_terlarang || "N/A"}</span>
            </td>
            <td>${barang.berat_barang || "N/A"}</td>
            <td class="has-text-centered">
              <button class="button is-danger removeProjectButton" data-barang-terlarang="${barang.barang_terlarang}">
                <i class="bx bx-trash"></i>          
              </button>
              <button class="button is-warning editProjectButton" data-barang-id="${barang._id}" data-barang-terlarang="${barang.barang_terlarang}" data-barang-mxberat="${barang.berat_barang}" data-barang-destinasi="${barang.destinasi}">
                <i class="bx bx-edit"></i>
              </button>
            </td>
          `;
          tableBody.appendChild(row);
        });
  
        // Initialize DataTable after populating the table body
        dataTable = $("#myTable").DataTable({
          responsive: true,
          autoWidth: false,
        });
  
        addRevealTextListeners();
        addMemberButtonListeners(); //  event listener tambah member
        addRemoveMemberButtonListeners(); //  event listener hapus member
        addRemoveProjectButtonListeners();
        addEditProjectButtonListeners(); //  event listener edit project
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
  
  // Function to add event listeners to addMemberButtons
//   function addMemberButtonListeners() {
//     document.querySelectorAll(".addMemberButton").forEach((button) => {
//       button.addEventListener("click", async (event) => {
//         const projectId = button.getAttribute("data-project-id");
//         const projectName =
//           button.getAttribute("data-project-name") ||
//           button.closest("tr").querySelector("td:first-child").innerText;
//         const { value: formValues } = await Swal.fire({
//           title: "Tambah Member",
//           html: `
//             <div class="field">
//               <div class="control">
//                 <label class="label">Nama Project</label>
//                 <input type="hidden" id="project-id" name="projectId" value="${projectId}">
//                 <input class="input" type="text" value="${projectName}" disabled>
//               </div>
//             </div>
//             <div class="field">
//               <label class="label">Nomor Telepon Calon Member</label>
//               <div class="control">
//                 <input class="input" type="tel" id="phonenumber" name="phonenumber" placeholder="628111" required>
//               </div>
//             </div>
//           `,
//           showCancelButton: true,
//           confirmButtonText: "Tambah Member",
//           didOpen: () => {
//             // Memanggil fungsi onInput setelah dialog SweetAlert2 dibuka
//             onInput("phonenumber", validatePhoneNumber);
//           },
//           preConfirm: () => {
//             const phoneNumber = document.getElementById("phonenumber").value;
//             const projectId = document.getElementById("project-id").value;
//             if (!phoneNumber) {
//               Swal.showValidationMessage(`Please enter a phone number`);
//             }
//             return { phoneNumber, projectId };
//           },
//         });
  
//         if (formValues) {
//           const { phoneNumber, projectId } = formValues;
//           // Logic to add member
//           //onInput("phonenumber", validatePhoneNumber);
//           let idprjusr = {
//             _id: projectId,
//             phonenumber: phoneNumber,
//           };
//           postJSON(
//             backend.project.anggota,
//             "login",
//             getCookie("login"),
//             idprjusr,
//             postResponseFunction
//           );
//         }
//       });
//     });
//   }
  
  // Add project event listener
  document.getElementById("addButton").addEventListener("click", () => {
    Swal.fire({
      title: "Tambah Barang Terlarang",
      html: `
              <div class="field">
                  <label class="label">Destinasi</label>
                  <div class="control">
                      <input class="input" type="text" id="destinasi" placeholder="masukan destinasi atau negara">
                  </div>
              </div>
              <div class="field">
                  <label class="label">Barang Terlarang</label>
                  <div class="control">
                      <textarea class="textarea" id="barang_terlarang" placeholder="Tulis barang terlarang"></textarea>
                  </div>
              </div>
              <div class="field">
                  <label class="label">Berat Maksimal Kiriman</label>
                  <div class="control">
                      <input class="input" min="0" step="0.01" type="number" id="berat_barang" placeholder="Masukan berat maksimal kiriman">
                  </div>
              </div>
          `,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const destinasi = Swal.getPopup().querySelector("#destinasi").value;
        const barangTerlarang= Swal.getPopup().querySelector("#barang_terlarang").value;
        const beratBarang = Swal.getPopup().querySelector("#berat_barang").value;
  
        if (!destinasi || !beratBarang|| !barangTerlarang) {
          Swal.showValidationMessage(`Please enter all fields`);
        } else {
          return {
            destinasi: destinasi,
            barang_terlarang: barangTerlarang,
            berat_barang: beratBarang,
          };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        let resultData = {
          destinasi: getValue("destinasi"),
          barang_terlarang: getValue("barang_terlarang"),
          berat_barang: getValue("berat_barang"),
        };
        if (getCookie("login") === "") {
          redirect("/login");
        } else {
          postJSON(
            backend.project.id,
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
      const katakata = "Pembuatan proyek baru " + result.data._id;
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "Selamat kak barang " +
          result.data.barang_terlarang +
          " sudah terdaftar dengan ID: " +
          result.data._id,
        footer:
          '<a href="https://wa.me/62895800006000?text=' +
          katakata +
          '" target="_blank">Verifikasi Barang</a>',
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
  
//   function postResponseFunction(result) {
//     if (result.status === 200) {
//       const katakata =
//         "Berhasil memasukkan member baru ke project " + result.data.name;
//       Swal.fire({
//         icon: "success",
//         title: "Berhasil",
//         text:
//           "Selamat kak proyek " +
//           result.data.name +
//           " dengan ID: " +
//           result.data._id +
//           " sudah mendapat member baru",
//         footer:
//           '<a href="https://wa.me/62895601060000?text=' +
//           katakata +
//           '" target="_blank">Verifikasi Proyek</a>',
//         didClose: () => {
//           reloadDataTable();
//         },
//       });
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: result.data.status,
//         text: result.data.response,
//       });
//     }
//     console.log(result);
//   }
  
  // Function to add event listeners to removeMemberButtons
//   function addRemoveMemberButtonListeners() {
//     document.querySelectorAll(".removeMemberButton").forEach((button) => {
//       button.addEventListener("click", async (event) => {
//         const projectName = button.getAttribute("data-project-name");
//         const memberPhoneNumber = button.getAttribute("data-member-phonenumber");
  
//         const result = await Swal.fire({
//           title: "Hapus member ini?",
//           text: "Kamu tidak dapat mengembalikan aksi ini!",
//           icon: "warning",
//           showCancelButton: true,
//           confirmButtonText: "Hapus member",
//           cancelButtonText: "Kembali",
//         });
  
//         if (result.isConfirmed) {
//           const memberWillBeDeleted = {
//             project_name: projectName,
//             phone_number: memberPhoneNumber,
//           };
  
//           deleteJSON(
//             backend.project.anggota,
//             "login",
//             getCookie("login"),
//             memberWillBeDeleted,
//             removeMemberResponse
//           );
//         }
//       });
//     });
//   }
  
//   function removeMemberResponse(result) {
//     if (result.status === 200) {
//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Member has been removed.",
//         didClose: () => {
//           reloadDataTable();
//         },
//       });
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: result.data.status,
//         text: result.data.response,
//       });
//     }
//     console.log(result);
//   }
  
  // Remove project mechanism
  function addRemoveProjectButtonListeners() {
    document.querySelectorAll(".removeProjectButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const barangTerlarang = button.getAttribute("data-barang-terlarang");
  
        const result = await Swal.fire({
          title: "Hapus project ini?",
          text: "Kamu tidak dapat mengembalikan aksi ini!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Hapus barang",
          cancelButtonText: "Kembali",
        });
  
        if (result.isConfirmed) {
          const barangWillBeDeleted = {
            barang_terlarang: barangTerlarang,
          };
  
          deleteJSON(
            backend.project.id,
            "login",
            getCookie("login"),
            barangWillBeDeleted,
            removeProjectResponse
          );
        }
      });
    });
  }
  
  function removeProjectResponse(result) {
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Project has been removed.",
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
  
  function addEditProjectButtonListeners() {
    document.querySelectorAll(".editProjectButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const barangId = button.getAttribute("data-barang-id");
        const barangTerlarang = button.getAttribute("data-barang-terlarang");
        const beratBarang = button.getAttribute("data-barang-mxberat");
        const barangDestinasi = button.getAttribute(
          "data-barang-destinasi"
        );
  
        const { value: formValues } = await Swal.fire({
          title: "Edit Barang Terlarang",
          html: `
            <div class="field">
              <label class="label">Destinasi</label>
              <div class="control">
                <input class="input" type="text" id="destinasi" value="${barangDestinasi}">
              </div>
            </div>
            <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" id="barang_terlarang">${barangTerlarang}</textarea>
            </div>
          </div>
            <div class="field">
              <label class="label">Berat Maksimal Kiriman</label>
              <div class="control">
                <input class="input" type="text" id="berat_barang" value="${beratBarang}">
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            const destinasi =
              Swal.getPopup().querySelector("#destinasi").value;
            const barangTerlarang = Swal.getPopup().querySelector("#barang_terlarang").value;
            const beratBarang = Swal.getPopup().querySelector("#berat_barang").value;
            if (!destinasi || !barangTerlarang || !beratBarang) {
                Swal.showValidationMessage(`Please enter all fields`);
              }              
            return {destinasi, barangTerlarang, beratBarang };
          },
        });
  
        if (formValues) {
          const { destinasi } = formValues;
          const updatedBarang = {
            _id: barangId,
            destinasi: destinasi,
            barang_terlarang: barangTerlarang,
            berat_barang: beratBarang,
          };
          putJSON(
            backend.project.id, // Assumes a POST method will handle updates as well
            "login",
            getCookie("login"),
            updatedBarang,
            updateResponseFunction
          );
        }
      });
    });
  }
  
  function updateResponseFunction(result) {
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Barang Updated",
        text: `Barang ${result.data.barang_terlarang} has been updated successfully.`,
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
  