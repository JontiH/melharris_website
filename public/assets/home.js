import { picture, reveal } from "./site.js";
import { PROJECTS } from "./projects.js";
import { cardHtml } from "./cards.js";

document.getElementById("hero-image").innerHTML = picture(PROJECTS[0].images[0], { eager: true });
document.getElementById("featured").innerHTML = PROJECTS.map(cardHtml).join("");
reveal();
