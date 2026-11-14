import { reveal } from "./site.js";
import { PROJECTS } from "./projects.js";
import { cardHtml } from "./cards.js";

document.getElementById("projects").innerHTML = PROJECTS.map(cardHtml).join("");
reveal();
