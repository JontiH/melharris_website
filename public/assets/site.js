import { houseSvg } from "./placeholder.js";

// Studio details used in the header, footer and contact page. Placeholders until she picks them.
export const SITE = {
  name: "Harris Interiors",
  tagline: "Interior Design",
  email: "hello@example.com",
  city: "Toronto, Ontario",
  instagram: "",
};

const NAV = [
  ["/", "Home"],
  ["/portfolio/", "Portfolio"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
];

function current(href) {
  const path = location.pathname;
  return href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, ""));
}

function renderHeader(el) {
  el.innerHTML = `
    <a class="brand" href="/">${SITE.name}<span>${SITE.tagline}</span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav">
      ${NAV.map(([href, label]) => `<a href="${href}"${current(href) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>`;
  const toggle = el.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = el.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  const onScroll = () => el.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function renderFooter(el) {
  el.innerHTML = `
    <div>
      <p class="footer-brand">${SITE.name}</p>
      <p>${SITE.tagline} · ${SITE.city}</p>
    </div>
    <div>
      <a href="mailto:${SITE.email}">${SITE.email}</a>
      ${SITE.instagram ? `<a href="${SITE.instagram}" rel="noopener">Instagram</a>` : ""}
    </div>
    <p class="footer-small">© ${new Date().getFullYear()} ${SITE.name}</p>`;
}

// Images without a src render as a cartoon house, so the layout can be judged before real photos exist.
export function picture(img, { eager = false, sizes = "100vw", shift = 0 } = {}) {
  if (img.src) {
    return `<img src="${img.src}" alt="${img.alt || img.room || ""}" sizes="${sizes}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  }
  return `<div class="ph" role="img" aria-label="${img.room || "Photo"}">${houseSvg(img.house, img.scene, shift)}<span>${img.room || "Photo"}</span></div>`;
}

const header = document.querySelector("[data-site-header]");
const footer = document.querySelector("[data-site-footer]");
if (header) renderHeader(header);
if (footer) renderFooter(footer);

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }
}, { rootMargin: "0px 0px -10% 0px" });

export function reveal(root = document) {
  root.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}
reveal();
