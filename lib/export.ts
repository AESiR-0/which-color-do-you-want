import { type PaletteColor } from "./color-engine";
import { hslToHex } from "./color-engine";

function cssVars(palette: PaletteColor[]): string {
  const lines = palette.map(
    (c) => `  --color-${c.role}: ${c.hex};`
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

function tailwindConfig(palette: PaletteColor[]): string {
  const colors = palette
    .map((c) => `    "${c.role}": "${c.hex}",`)
    .join("\n");
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors}\n      },\n    },\n  },\n};\n`;
}

function scssVars(palette: PaletteColor[]): string {
  return palette.map((c) => `$color-${c.role}: ${c.hex};`).join("\n");
}

function markdownTable(palette: PaletteColor[]): string {
  const rows = palette.map(
    (c) =>
      `| ${c.role.padEnd(12)} | ${c.hex.toUpperCase()} | hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%) |`
  );
  return `# Palette\n\n| Role         | HEX     | HSL                     |\n|--------------|---------|-------------------------|\n${rows.join("\n")}\n`;
}

function jsonExport(palette: PaletteColor[]): string {
  const obj: Record<string, unknown> = {};
  palette.forEach((c) => {
    obj[c.role] = {
      hex: c.hex,
      hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
    };
  });
  return JSON.stringify(obj, null, 2);
}

export type ExportFormat = "css" | "tailwind" | "scss" | "json" | "markdown";

export function exportPalette(palette: PaletteColor[], format: ExportFormat): string {
  switch (format) {
    case "css": return cssVars(palette);
    case "tailwind": return tailwindConfig(palette);
    case "scss": return scssVars(palette);
    case "json": return jsonExport(palette);
    case "markdown": return markdownTable(palette);
  }
}

export function downloadPalette(palette: PaletteColor[], format: ExportFormat) {
  const content = exportPalette(palette, format);
  const ext: Record<ExportFormat, string> = {
    css: "css", tailwind: "js", scss: "scss", json: "json", markdown: "md",
  };
  const mimeMap: Record<ExportFormat, string> = {
    css: "text/css",
    tailwind: "text/javascript",
    scss: "text/x-scss",
    json: "application/json",
    markdown: "text/markdown",
  };
  const blob = new Blob([content], { type: mimeMap[format] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `palette.${ext[format]}`;
  a.click();
  URL.revokeObjectURL(url);
}
