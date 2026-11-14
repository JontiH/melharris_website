// Sample projects. Each image takes a `src` (path under /images/) once real photos exist;
// until then it shows a cartoon house in the project's `house` colour.
export const PROJECTS = [
  {
    slug: "victorian-family-home",
    house: "#8fb3d9",
    title: "Victorian Family Home",
    location: "Toronto",
    year: 2025,
    scope: "Full renovation",
    summary: "A narrow 1890s house opened up for a family of five, keeping the original mouldings and stair.",
    body: [
      "The owners wanted more light and room to gather without losing the character that drew them to the house. We removed the wall between the kitchen and dining room, kept the plaster cornices, and carried one warm white through every floor so the rooms read as a whole.",
      "Furniture was a mix of new upholstered pieces and the family's own antiques, re-covered in linens and wools that stand up to children and a dog.",
    ],
    images: [
      { room: "Living room" },
      { room: "Kitchen" },
      { room: "Dining room" },
      { room: "Stair hall" },
      { room: "Primary bedroom" },
    ],
  },
  {
    slug: "lakeside-cottage",
    house: "#f2cf6b",
    title: "Lakeside Cottage",
    location: "Muskoka",
    year: 2024,
    scope: "Furnishing and styling",
    summary: "A 1970s cottage refurnished for year-round use, with pieces chosen to weather sun, sand and wet dogs.",
    body: [
      "The bones were sound, so the work was in the furnishing: deep sofas facing the water, a long dining table for twelve, and bunk rooms that make guests feel looked after.",
      "Colours come from the view: pale greens and greys, weathered wood, and a little rust red.",
    ],
    images: [
      { room: "Great room" },
      { room: "Dining" },
      { room: "Screened porch" },
      { room: "Bunk room" },
    ],
  },
  {
    slug: "city-condo",
    house: "#e39b88",
    title: "City Condo",
    location: "Toronto",
    year: 2024,
    scope: "Kitchen and living",
    summary: "An 850 square foot condo made calmer and more useful, with storage built into every wall.",
    body: [
      "A downsizing couple moving from a large house needed a home for their art and books. Built-in walnut millwork holds the library, hides the television and frames the windows.",
      "A soft palette of stone, oak and cream keeps the small rooms quiet, with colour coming from the art.",
    ],
    images: [
      { room: "Living room" },
      { room: "Kitchen" },
      { room: "Library wall" },
      { room: "Bedroom" },
    ],
  },
  {
    slug: "farmhouse-kitchen",
    house: "#9fc29a",
    title: "Farmhouse Kitchen",
    location: "Prince Edward County",
    year: 2023,
    scope: "Kitchen and mudroom",
    summary: "A working farmhouse kitchen with a plaster hood, a big island and a mudroom built for muddy boots.",
    body: [
      "The kitchen is the heart of this house, so it had to work hard: a range for serious cooking, an island that seats six, and a pantry for preserves.",
      "Limewashed walls, unlacquered brass and reclaimed pine floors were chosen to age with the house.",
    ],
    images: [
      { room: "Kitchen" },
      { room: "Island" },
      { room: "Pantry" },
      { room: "Mudroom" },
    ],
  },
];

for (const p of PROJECTS) {
  p.images.forEach((img, i) => {
    img.house ??= p.house;
    img.scene ??= i;
  });
}

export const bySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
