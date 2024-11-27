import { getValue, onClick, hide, show } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js";
import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { backend } from "/dashboard/jscroot/url/config.js";

export async function main() {
  onClick("tombolbuatproyek", handleFAQSubmit);
}

function handleFAQSubmit() {
  const faq = {
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
      faq,
      handleFAQResponse
    );
    hide("tombolbuatproyek");
  }
}

function handleFAQResponse(result) {
  if (result.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "FAQ has been added successfully.",
      didClose: () => {
        redirect("/dashboard/faq"); // Redirect to FAQ list page
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: result.data.status,
      text: result.data.response,
    });
    show("tombolbuatproyek");
  }
}
