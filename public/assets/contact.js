import { SITE } from "./site.js";

const mail = document.querySelector("[data-email]");
mail.href = `mailto:${SITE.email}`;
mail.textContent = SITE.email;
document.querySelector("[data-city]").textContent = SITE.city;

const form = document.querySelector("form.contact");
const status = form.querySelector(".form-status");
const button = form.querySelector("button[type=submit]");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.classList.remove("error");
  if (!form.checkValidity()) {
    status.classList.add("error");
    status.textContent = "Please fill in your name, a valid email and a message.";
    return;
  }
  button.disabled = true;
  status.textContent = "Sending…";
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "send failed");
    form.reset();
    status.textContent = "Thank you. Your message is on its way and we'll be in touch soon.";
  } catch {
    status.classList.add("error");
    status.textContent = `Sorry, that didn't go through. Please email ${SITE.email} directly.`;
  } finally {
    button.disabled = false;
  }
});
