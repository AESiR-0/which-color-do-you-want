"use client";

import { useRef, useEffect } from "react";
import type { DesignIdentity } from "@/lib/taste-engine";

interface Props {
  html: string;
  palette: Record<string, string>;
  identity: DesignIdentity;
  className?: string;
}

export default function HtmlPreview({ html, palette, identity, className = "" }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !html) return;

    const cssVars = Object.entries(palette)
      .map(([role, hex]) => `--color-${role}: ${hex};`)
      .join("\n    ");

    const doc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=${identity.typography.heading.replace(/ /g, "+")}&family=${identity.typography.body.replace(/ /g, "+")}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    :root {
      ${cssVars}
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: '${identity.typography.body}', system-ui, sans-serif;
      background: var(--color-background, #fff);
      color: var(--color-text, #111);
      overflow: auto;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: '${identity.typography.heading}', system-ui, sans-serif;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [html, palette, identity]);

  return (
    <iframe
      ref={iframeRef}
      className={`w-full h-full border-0 bg-white ${className}`}
      sandbox="allow-scripts allow-same-origin"
      title="HTML Preview"
    />
  );
}
