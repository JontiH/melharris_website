import { SITE } from "./site.js";

const mail = document.querySelector("[data-email]");
mail.href = `mailto:${SITE.email}`;
mail.textContent = SITE.email;
document.querySelector("[data-city]").textContent = SITE.city;

const form = document.querySelector("form.contact");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.classList.remove("error");
  if (!form.checkValidity()) {
    status.classList.add("error");
    status.textContent = "Please fill in your name, a valid email and a message.";
    return;
  }
  const f = Object.fromEntries(new FormData(form));
  const signature = [f.name, f.email, f.phone, f.type && `Project: ${f.type}`].filter(Boolean);
  const body = `${f.message}\n\n${signature.join("\n")}`;
  const subject = `Project enquiry from ${f.name}`;
  location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = `Your email app should open with the message ready to send. If it doesn't, write to ${SITE.email}.`;
});
