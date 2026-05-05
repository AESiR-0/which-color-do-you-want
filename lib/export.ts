import { type PaletteColor } from "./color-engine";
import { type DesignIdentity, getPrompt } from "./taste-engine";

function cssVars(palette: PaletteColor[]): string {
  const lines = palette.map(
    (c) => `  --color-${c.role}: ${c.hex};`
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

function tailwindConfig(palette: PaletteColor[], identity: DesignIdentity): string {
  const colors = palette
    .map((c) => `        "${c.role}": "${c.hex}",`)
    .join("\n");
  
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      },
      fontFamily: {
        heading: ["${identity.typography.heading}", "sans-serif"],
        body: ["${identity.typography.body}", "sans-serif"],
      },
      borderRadius: {
        "custom": "${identity.borderRadius}",
      }
    },
  },
};
`;
}

function scssVars(palette: PaletteColor[]): string {
  return palette.map((c) => `$color-${c.role}: ${c.hex};`).join("\n");
}

function markdownTable(palette: PaletteColor[], identity: DesignIdentity): string {
  const rows = palette.map(
    (c) =>
      `| ${c.role.padEnd(12)} | ${c.hex.toUpperCase()} | hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%) |`
  );
  return `# Design System: ${identity.label}

## Colors
| Role         | HEX     | HSL                     |
|--------------|---------|-------------------------|
${rows.join("\n")}

## Typography
- **Heading**: ${identity.typography.heading}
- **Body**: ${identity.typography.body}

## Insights
${identity.insight}
`;
}

function jsonExport(palette: PaletteColor[], identity: DesignIdentity): string {
  const obj: Record<string, unknown> = {
    identity: identity.label,
    colors: {},
    typography: identity.typography,
    borderRadius: identity.borderRadius
  };
  palette.forEach((c) => {
    (obj.colors as any)[c.role] = {
      hex: c.hex,
      hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
    };
  });
  return JSON.stringify(obj, null, 2);
}

function promptExport(palette: PaletteColor[], identity: DesignIdentity): string {
  const colors: any = {};
  palette.forEach(c => colors[c.role] = c.hex);
  return getPrompt(identity, colors);
}

export type ExportFormat = "css" | "tailwind" | "scss" | "json" | "markdown" | "prompt";

export function exportPalette(palette: PaletteColor[], format: ExportFormat, identity: DesignIdentity): string {
  switch (format) {
    case "css": return cssVars(palette);
    case "tailwind": return tailwindConfig(palette, identity);
    case "scss": return scssVars(palette);
    case "json": return jsonExport(palette, identity);
    case "markdown": return markdownTable(palette, identity);
    case "prompt": return promptExport(palette, identity);
  }
}

export function downloadPalette(palette: PaletteColor[], format: ExportFormat, identity: DesignIdentity) {
  const content = exportPalette(palette, format, identity);
  const ext: Record<ExportFormat, string> = {
    css: "css", tailwind: "js", scss: "scss", json: "json", markdown: "md", prompt: "txt"
  };
  const mimeMap: Record<ExportFormat, string> = {
    css: "text/css",
    tailwind: "text/javascript",
    scss: "text/x-scss",
    json: "application/json",
    markdown: "text/markdown",
    prompt: "text/plain"
  };
  const blob = new Blob([content], { type: mimeMap[format] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `design-system.${ext[format]}`;
  a.click();
  URL.revokeObjectURL(url);
}
