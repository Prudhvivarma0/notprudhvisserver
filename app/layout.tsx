import type { Metadata } from "next";
import { Anton, Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ScrollReset } from "@/components/ScrollReset";
import { DEFAULT_CONTENT } from "@/lib/content";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

async function getSeoMeta(): Promise<{ title: string; description: string; ogImage: string }> {
  try {
    // Only available in Cloudflare Pages environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (process.env as any).DB as D1Database | undefined;
    if (!db) return DEFAULT_CONTENT.seo;
    const row = await db
      .prepare("SELECT data FROM v3_content WHERE id = 1")
      .first<{ data: string }>();
    if (!row?.data) return DEFAULT_CONTENT.seo;
    const parsed = JSON.parse(row.data) as { seo?: { title?: string; description?: string; ogImage?: string } };
    return {
      title:       parsed.seo?.title       ?? DEFAULT_CONTENT.seo.title,
      description: parsed.seo?.description ?? DEFAULT_CONTENT.seo.description,
      ogImage:     parsed.seo?.ogImage     ?? DEFAULT_CONTENT.seo.ogImage,
    };
  } catch {
    return DEFAULT_CONTENT.seo;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta();
  const meta: Metadata = {
    title: seo.title,
    description: seo.description,
  };
  if (seo.ogImage) {
    meta.openGraph = {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    };
  }
  return meta;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${anton.variable} ${interTight.variable} ${jetbrains.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              history.scrollRestoration = "manual";
              if (window.location.hash) history.replaceState(null, "", window.location.pathname);
              window.scrollTo(0, 0);
              var t = localStorage.getItem("v3-theme");
              if (t) document.documentElement.setAttribute("data-theme", t);
            `,
          }}
        />
      </head>
      <body>
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
