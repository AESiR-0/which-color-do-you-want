// Top ~220 Google Fonts sorted by popularity
export const GOOGLE_FONTS: string[] = [
  "Inter","Roboto","Open Sans","Noto Sans","Montserrat","Lato","Poppins","Roboto Condensed",
  "Source Sans 3","Oswald","Raleway","Noto Sans JP","Ubuntu","Roboto Mono","Nunito",
  "Roboto Slab","Playfair Display","Nunito Sans","Rubik","Merriweather","PT Sans",
  "Work Sans","Noto Serif","Fira Sans","Kanit","Lora","DM Sans","Quicksand","Mulish",
  "Barlow","Inconsolata","Manrope","PT Serif","Karla","Heebo","Noto Sans KR",
  "Libre Franklin","Josefin Sans","Outfit","Libre Baskerville","Arimo","Cabin",
  "Source Code Pro","Dosis","Bitter","Mukta","Noto Sans TC","Abel","Hind",
  "Archivo","Titillium Web","IBM Plex Sans","Jost","PT Sans Narrow","Oxygen",
  "Nanum Gothic","Source Serif 4","Space Grotesk","Overpass","Crimson Text",
  "Plus Jakarta Sans","Exo 2","Varela Round","Cormorant Garamond","Fjalla One",
  "Asap","Play","Comfortaa","Maven Pro","Assistant","Prompt","Signika Negative",
  "Catamaran","EB Garamond","Questrial","Teko","Dancing Script","Lobster",
  "Shadows Into Light","Indie Flower","Pacifico","Caveat","Permanent Marker",
  "Amatic SC","Satisfy","Alfa Slab One","Patrick Hand","Courgette","Great Vibes",
  "Kaushan Script","Gloria Hallelujah","Sacramento","Righteous","Bangers","Russo One",
  "Yanone Kaffeesatz","Archivo Black","Abril Fatface","Secular One","Bree Serif",
  "Crete Round","Vollkorn","Spectral","Alegreya","Alegreya Sans","Noticia Text",
  "Literata","Gelasio","Zilla Slab","Frank Ruhl Libre","DM Serif Display",
  "DM Serif Text","Fraunces","Bricolage Grotesque","Sora","Red Hat Display",
  "Red Hat Text","Urbanist","Lexend","Figtree","Geist","Atkinson Hyperlegible",
  "Public Sans","Be Vietnam Pro","Albert Sans","Encode Sans","Commissioner",
  "Noto Sans Display","General Sans","Satoshi","Clash Display","Cabinet Grotesk",
  "Switzer","Synonym","Chillax","Gambetta","Zodiak","Boska","Erode","Sentient",
  "Ranade","Telma","Supreme","Plein","Tanker","Alpino","Melodrama",
  "Instrument Sans","Instrument Serif","Gabarito","Onest","Wix Madefor Display",
  "Wix Madefor Text","Schibsted Grotesk","Hanken Grotesk","Familjen Grotesk",
  "Host Grotesk","Darker Grotesque","Epilogue","Syne","Climate Crisis",
  "Unbounded","Big Shoulders Display","Chivo","Archivo Narrow","Saira",
  "Barlow Condensed","Barlow Semi Condensed","Fira Sans Condensed",
  "IBM Plex Mono","IBM Plex Serif","JetBrains Mono","Fira Code","Victor Mono",
  "Cascadia Code","Space Mono","Anonymous Pro","Courier Prime","Major Mono Display",
  "Silkscreen","Press Start 2P","VT323","Pixelify Sans","Orbitron","Audiowide",
  "Chakra Petch","Rajdhani","Michroma","Exo","Oxanium","Share Tech Mono",
  "Bungee","Bungee Shade","Bungee Inline","Bungee Hairline","Bungee Outline",
  "Monoton","Honk","Kablammo","Rubik Glitch","Rubik Vinyl","Rubik Wet Paint",
  "Rubik Burned","Rubik Dirt","Rubik Distressed","Rubik Maze","Rubik Iso",
  "Rubik Mono One","Rubik Moonrocks","Rubik Puddles","Rubik Storm",
  "Rubik Microbe","Rubik Broken Fax","Rubik Doodle Shadow","Rubik Doodle Triangles",
  "Rubik Scribble","Rubik Spray Paint","Rubik Lines","Rubik Maps","Rubik Pixels",
  "Protest Guerrilla","Protest Revolution","Protest Riot","Protest Strike",
  "Playwrite DE Grund","Playwrite US Modern","Playwrite GB S",
];

export interface FontPairing {
  label: string;
  heading: string;
  body: string;
}

export const POPULAR_PAIRINGS: FontPairing[] = [
  { label: "Inter + Inter", heading: "Inter", body: "Inter" },
  { label: "Playfair + Inter", heading: "Playfair Display", body: "Inter" },
  { label: "Space Grotesk + Inter", heading: "Space Grotesk", body: "Inter" },
  { label: "Outfit + Inter", heading: "Outfit", body: "Inter" },
  { label: "Archivo Black + Inter", heading: "Archivo Black", body: "Inter" },
  { label: "Plus Jakarta + Inter", heading: "Plus Jakarta Sans", body: "Inter" },
  { label: "DM Serif + DM Sans", heading: "DM Serif Display", body: "DM Sans" },
  { label: "Fraunces + Lato", heading: "Fraunces", body: "Lato" },
  { label: "Sora + Inter", heading: "Sora", body: "Inter" },
  { label: "Bricolage + Inter", heading: "Bricolage Grotesque", body: "Inter" },
  { label: "Instrument Serif + Inter", heading: "Instrument Serif", body: "Inter" },
  { label: "Unbounded + Figtree", heading: "Unbounded", body: "Figtree" },
  { label: "Urbanist + Urbanist", heading: "Urbanist", body: "Urbanist" },
  { label: "Manrope + Manrope", heading: "Manrope", body: "Manrope" },
  { label: "Gabarito + Public Sans", heading: "Gabarito", body: "Public Sans" },
  { label: "Red Hat + Red Hat", heading: "Red Hat Display", body: "Red Hat Text" },
  { label: "Epilogue + Epilogue", heading: "Epilogue", body: "Epilogue" },
  { label: "Syne + Inter", heading: "Syne", body: "Inter" },
  { label: "Lexend + Lexend", heading: "Lexend", body: "Lexend" },
  { label: "Cormorant + Mulish", heading: "Cormorant Garamond", body: "Mulish" },
];

// Lazily loaded font cache
const loadedFonts = new Set<string>(["Inter"]);

export function loadGoogleFont(fontName: string) {
  if (typeof document === "undefined" || loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
  document.head.appendChild(link);
}

export function loadFontPair(heading: string, body: string) {
  loadGoogleFont(heading);
  loadGoogleFont(body);
}
