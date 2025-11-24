// contact form (frontend demo)
function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  status.textContent = "Thanks — this demo form doesn't send yet. Hook to an email service or backend.";
  // reset form fields optionally
  setTimeout(() => {
    status.textContent = "";
    e.target?.reset?.();
  }, 3500);
}

// wire form submit for non-inline cases
document.querySelectorAll(".contact-form").forEach(form => {
  form.addEventListener("submit", handleSubmit);
});

// set year
document.getElementById("year").textContent = new Date().getFullYear();
