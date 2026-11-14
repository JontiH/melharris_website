import { picture } from "./site.js";

export function cardHtml(p) {
  const cover = p.images[p.cover ?? 0];
  return `<a class="card reveal" href="/portfolio/${p.slug}">
    <div class="frame r-4x5">${picture(cover, { sizes: "(max-width: 720px) 100vw, 50vw" })}</div>
    <div class="card-meta"><h3>${p.title}</h3><span>${p.location}</span></div>
  </a>`;
}
