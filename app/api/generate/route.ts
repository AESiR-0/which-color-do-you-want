import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, palette, identity } = await req.json();

    const systemPrompt = `You are an expert frontend developer. Generate a single self-contained HTML snippet that can be rendered inside an iframe.

RULES:
- Output ONLY the HTML code, no markdown fences, no explanation.
- Use Tailwind CSS classes (the CDN is already loaded in the iframe).
- Apply the provided color palette using inline styles or CSS variables.
- The design should be responsive and look great at any size.
- Keep it to a single page section (hero, pricing card, dashboard widget, etc.)
- Do NOT include <html>, <head>, or <body> tags — just the inner content div.
- Make it visually stunning and production-quality.

COLOR PALETTE:
${Object.entries(palette).map(([role, hex]) => `--color-${role}: ${hex}`).join("\n")}

TYPOGRAPHY:
- Heading font: ${identity.heading}
- Body font: ${identity.body}

DESIGN STYLE: ${identity.vibe || "modern and clean"}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Groq API error: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    let html = data.choices?.[0]?.message?.content ?? "";

    // Strip markdown code fences if present
    html = html.replace(/^```(?:html)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    return NextResponse.json({ html });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
