import { SITE, picture, reveal } from "./site.js";
import { PROJECTS, bySlug } from "./projects.js";

// _redirects rewrites /portfolio/<slug> to this page, so the slug comes from the path.
const slug = location.pathname.replace(/\/+$/, "").split("/").pop();
const project = bySlug(slug);
if (!project) location.replace("/portfolio/");
else render(project);

function render(p) {
  const i = PROJECTS.indexOf(p);
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  document.title = `${p.title} · ${SITE.name}`;
  const set = (f, html) => (document.querySelector(`[data-f="${f}"]`).innerHTML = html);
  set("title", p.title);
  set("location", p.location);
  set("scope", p.scope);
  set("year", p.year);
  set("summary", p.summary);
  set("body", p.body.map((t) => `<p>${t}</p>`).join(""));
  set("next", next.title);
  document.querySelector(".next-project").href = `/portfolio/${next.slug}`;

  const track = document.querySelector(".gallery-track");
  track.innerHTML = p.images
    .map((img, n) => `<button class="slide frame" data-n="${n}" aria-label="Open ${img.room || "photo"} full screen">${picture(img, { eager: n === 0, sizes: "80vw" })}</button>`)
    .join("");
  gallery(track, p.images);
  reveal();
}

function gallery(track, images) {
  const slides = [...track.children];
  const count = document.querySelector(".gallery-bar .count");
  const prev = document.querySelector(".gallery-bar .prev");
  const next = document.querySelector(".gallery-bar .next");
  let index = 0;

  const go = (n) => {
    const s = slides[Math.max(0, Math.min(slides.length - 1, n))];
    track.scrollTo({ left: s.offsetLeft - slides[0].offsetLeft, behavior: "smooth" });
  };
  const update = () => {
    const x = track.scrollLeft;
    index = slides.reduce((best, s, n) =>
      Math.abs(s.offsetLeft - slides[0].offsetLeft - x) < Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - x) ? n : best, 0);
    const atEnd = x + track.clientWidth >= track.scrollWidth - 2;
    if (atEnd) index = slides.length - 1;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    prev.disabled = x <= 2;
    next.disabled = atEnd;
  };
  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));
  track.addEventListener("scroll", update, { passive: true });
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  });
  window.addEventListener("resize", update);
  update();

  const lb = document.querySelector(".lightbox");
  const lbFrame = lb.querySelector(".frame");
  const lbCount = lb.querySelector(".lb-count");
  let open = 0;
  const show = (n) => {
    open = (n + images.length) % images.length;
    lbFrame.innerHTML = picture(images[open], { eager: true });
    lbCount.textContent = `${open + 1} / ${images.length}`;
  };
  const close = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    go(open);
  };
  track.addEventListener("click", (e) => {
    const s = e.target.closest(".slide");
    if (!s) return;
    show(Number(s.dataset.n));
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(open - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(open + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(open + 1);
    if (e.key === "ArrowLeft") show(open - 1);
  });
}
