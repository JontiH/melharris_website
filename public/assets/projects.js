// Sample projects. Each image takes a `src` (path under /images/) once real photos exist;
// until then `tone` sets the stand-in colours (wall, floor, accent).
export const PROJECTS = [
  {
    slug: "victorian-family-home",
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
      { room: "Living room", tone: ["#e4dccf", "#9c8670", "#6f5843"] },
      { room: "Kitchen", tone: ["#ece8e1", "#b8a58e", "#3f4a44"] },
      { room: "Dining room", tone: ["#d8cbb8", "#8a7058", "#5b3f2c"] },
      { room: "Stair hall", tone: ["#e9e2d6", "#a3896d", "#7a6450"] },
      { room: "Primary bedroom", tone: ["#ddd6cc", "#b09a82", "#8b7d6b"] },
    ],
  },
  {
    slug: "lakeside-cottage",
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
      { room: "Great room", tone: ["#dfe2da", "#a08a6c", "#5d6b5a"] },
      { room: "Dining", tone: ["#e6e3db", "#9a7d5f", "#8c4a32"] },
      { room: "Screened porch", tone: ["#d5dbd2", "#8f7a60", "#4f5d4f"] },
      { room: "Bunk room", tone: ["#e8e4da", "#ad9472", "#6c7b6a"] },
    ],
  },
  {
    slug: "city-condo",
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
      { room: "Living room", tone: ["#ebe6de", "#8e7258", "#4a3b2e"] },
      { room: "Kitchen", tone: ["#e7e3dc", "#c1b19c", "#5a524a"] },
      { room: "Library wall", tone: ["#ddd3c4", "#7f644b", "#3e2f23"] },
      { room: "Bedroom", tone: ["#e9e1d8", "#b8a18a", "#a07c6a"] },
    ],
  },
  {
    slug: "farmhouse-kitchen",
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
      { room: "Kitchen", tone: ["#ede6d9", "#9d7f5c", "#4d5a4c"] },
      { room: "Island", tone: ["#e2d9ca", "#8a6c4c", "#b08d57"] },
      { room: "Pantry", tone: ["#e8e1d3", "#a68a69", "#6d7b6e"] },
      { room: "Mudroom", tone: ["#dad3c6", "#7d6a55", "#3f4c45"] },
    ],
  },
];

export const bySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
