import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

async function callGroq(messages: { role: string; content: string }[], maxTokens = 4096) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, palette, identity, mode } = await req.json();

    const paletteStr = Object.entries(palette)
      .map(([role, hex]) => `--color-${role}: ${hex}`)
      .join("\n");

    // ── Step 1: Optimize the prompt ──
    if (mode === "optimize" || !mode) {
      const optimizeSystemPrompt = `You are an expert UI/UX design prompt engineer. Your job is to take a vague or simple user request and transform it into a detailed, specific prompt for generating production-quality HTML/Tailwind UI components.

RULES:
- Output ONLY the optimized prompt text, no explanation, no markdown.
- Make the prompt specific about layout, spacing, typography, hover states, animations, gradients, shadows.
- Include details about component structure (grid, flexbox, cards, etc.)
- Mention responsive behavior.
- Reference the color palette roles (primary, secondary, accent, background, text, surface) by name.
- Keep it concise but detailed — 3-5 sentences max.
- The prompt should describe a stunning, modern UI section.

COLOR PALETTE AVAILABLE:
${paletteStr}

TYPOGRAPHY:
- Heading font: ${identity.heading}
- Body font: ${identity.body}

DESIGN STYLE: ${identity.vibe || "modern and clean"}`;

      const optimizedPrompt = await callGroq([
        { role: "system", content: optimizeSystemPrompt },
        { role: "user", content: `Optimize this UI generation prompt: "${prompt}"` },
      ], 512);

      return NextResponse.json({ optimizedPrompt: optimizedPrompt.trim() });
    }

    // ── Step 2: Generate HTML from optimized prompt ──
    if (mode === "generate") {
      const generateSystemPrompt = `You are an expert frontend developer. Generate a single self-contained HTML snippet that can be rendered inside an iframe.

RULES:
- Output ONLY the HTML code, no markdown fences, no explanation.
- Use Tailwind CSS classes (the CDN is already loaded in the iframe).
- Apply the provided color palette using inline styles or CSS variables.
- The design should be responsive and look great at any size.
- Keep it to a single page section (hero, pricing card, dashboard widget, etc.)
- Do NOT include <html>, <head>, or <body> tags — just the inner content div.
- Make it visually stunning and production-quality.
- Use subtle animations, gradients, shadows where appropriate.
- Ensure proper spacing and typography hierarchy.

COLOR PALETTE:
${paletteStr}

TYPOGRAPHY:
- Heading font: ${identity.heading}
- Body font: ${identity.body}

DESIGN STYLE: ${identity.vibe || "modern and clean"}`;

      let html = await callGroq([
        { role: "system", content: generateSystemPrompt },
        { role: "user", content: prompt },
      ], 4096);

      // Strip markdown code fences if present
      html = html.replace(/^```(?:html)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

      return NextResponse.json({ html });
    }

    return NextResponse.json({ error: "Invalid mode. Use 'optimize' or 'generate'." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
