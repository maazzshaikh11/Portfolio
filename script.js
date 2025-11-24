// =========================
// script.js — EmailJS-ready + safe fallback
// =========================

// FOOTER YEAR (id="year" expected in HTML)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------------------------
// Demo fallback (keeps original behavior for other forms)
// -------------------------
function handleSubmitFallback(e) {
  e.preventDefault();
  const statusEl = document.getElementById("formStatus");
  if (statusEl) {
    statusEl.textContent = "Thanks — this demo form doesn't send yet. Hook to an email service or backend.";
    setTimeout(() => {
      statusEl.textContent = "";
      try { e.target.reset(); } catch {}
    }, 3500);
  }
}

// attach fallback to any .contact-form that isn't the EmailJS-wired one
document.querySelectorAll(".contact-form").forEach(f => {
  if (f.id !== "contactForm") f.addEventListener("submit", handleSubmitFallback);
});

// -------------------------
// EmailJS SDK loader + init
// -------------------------
(function loadEmailJSSDK() {
  if (window.emailjs) return;

  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
  s.async = true;
  s.onload = () => {
    try {
      emailjs.init("7QI5QDM3Jz_swZ_AF"); // your public key
      window.__emailjs_ready = true;
    } catch (err) {
      console.warn("EmailJS init failed:", err);
      window.__emailjs_ready = false;
    }
  };
  s.onerror = () => {
    console.warn("Failed to load EmailJS SDK.");
    window.__emailjs_ready = false;
  };
  document.head.appendChild(s);
})();

// helper: wait for emailjs available
function waitForEmailJS(timeout = 5000) {
  const start = Date.now();
  return new Promise((resolve) => {
    if (window.emailjs && window.__emailjs_ready) return resolve(true);

    const iv = setInterval(() => {
      if (window.emailjs && window.__emailjs_ready) {
        clearInterval(iv);
        return resolve(true);
      }
      if (Date.now() - start > timeout) {
        clearInterval(iv);
        return resolve(false);
      }
    }, 150);
  });
}

// -------------------------
// Contact form handler
// -------------------------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sendBtn = document.getElementById("sendBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    sendBtn.disabled = true;
    formStatus.textContent = "Sending…";

    const templateParams = {
      from_name: contactForm.from_name.value,
      reply_to: contactForm.reply_to.value,
      message: contactForm.message.value
    };

    if (!templateParams.from_name || !templateParams.reply_to || !templateParams.message) {
      formStatus.textContent = "Please fill all fields.";
      sendBtn.disabled = false;
      return;
    }

    const SERVICE_ID = "service_aq59d2r";
    const TEMPLATE_ID = "template_gazl2og";

    const ready = await waitForEmailJS();
    if (!ready) {
      formStatus.textContent = "Email service not ready. Try again later.";
      sendBtn.disabled = false;
      return;
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        formStatus.textContent = "Message sent! Thanks.";
        contactForm.reset();
        sendBtn.disabled = false;
        setTimeout(() => formStatus.textContent = "", 3500);
      })
      .catch((err) => {
        console.error("EmailJS send error:", err);
        formStatus.textContent = "Failed to send. Try again later.";
        sendBtn.disabled = false;
      });
  });
}
