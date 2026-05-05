import { type ColorRole, type HSL, hslToHex } from "./color-engine";

export type TasteIdentityId = 
  | "brutalist-saas" 
  | "luxury-editorial" 
  | "ai-startup" 
  | "neo-banking" 
  | "streetwear-bold";

export interface Typography {
  heading: string;
  body: string;
}

export interface DesignIdentity {
  id: TasteIdentityId;
  label: string;
  typography: Typography;
  borderRadius: string;
  borderWidth: string;
  shadow: string;
  vibe: string;
  insight: string;
}

export const TASTE_IDENTITIES: Record<TasteIdentityId, DesignIdentity> = {
  "brutalist-saas": {
    id: "brutalist-saas",
    label: "Brutalist SaaS",
    typography: { heading: "Space Grotesk", body: "Inter" },
    borderRadius: "0px",
    borderWidth: "2px",
    shadow: "4px 4px 0px 0px rgba(0,0,0,1)",
    vibe: "bold-and-raw",
    insight: "Sharp edges and thick borders command attention. This style balances raw utility with high-end SaaS efficiency."
  },
  "luxury-editorial": {
    id: "luxury-editorial",
    label: "Luxury Editorial",
    typography: { heading: "Playfair Display", body: "Inter" },
    borderRadius: "8px",
    borderWidth: "0px",
    shadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
    vibe: "elegant-and-airy",
    insight: "Serif headings and generous whitespace create an aura of exclusivity and premium authority."
  },
  "ai-startup": {
    id: "ai-startup",
    label: "AI Startup Dark Mode",
    typography: { heading: "Outfit", body: "Inter" },
    borderRadius: "24px",
    borderWidth: "1px",
    shadow: "0 0 40px -10px rgba(99, 102, 241, 0.2)",
    vibe: "futuristic-and-dark",
    insight: "Vibrant accents on deep backgrounds evoke a sense of innovation. Large radii feel approachable and modern."
  },
  "neo-banking": {
    id: "neo-banking",
    label: "Neo Banking Clean",
    typography: { heading: "Plus Jakarta Sans", body: "Inter" },
    borderRadius: "16px",
    borderWidth: "0px",
    shadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
    vibe: "trustworthy-and-precise",
    insight: "Soft corners and subtle shadows build trust. The geometric typography feels precise and reliable."
  },
  "streetwear-bold": {
    id: "streetwear-bold",
    label: "Streetwear Bold",
    typography: { heading: "Archivo Black", body: "Inter" },
    borderRadius: "4px",
    borderWidth: "0px",
    shadow: "10px 10px 0px -2px rgba(0,0,0,0.2)",
    vibe: "loud-and-fast",
    insight: "High-energy colors and heavy typography create a visceral, trend-forward connection."
  }
};

export function getRandomIdentity(): DesignIdentity {
  const ids = Object.keys(TASTE_IDENTITIES) as TasteIdentityId[];
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  return TASTE_IDENTITIES[randomId];
}

export function getPrompt(identity: DesignIdentity, palette: Record<ColorRole, string>): string {
  const primary = palette.primary;
  return `Design a ${identity.label} landing page using ${primary} as the primary color, with ${identity.typography.heading} for headings and ${identity.typography.body} for body text. The style should be ${identity.vibe} with ${identity.borderRadius} border radius.`;
}
