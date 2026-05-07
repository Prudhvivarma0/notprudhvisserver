import type { Metadata } from "next";
import { Anton, Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ScrollReset } from "@/components/ScrollReset";

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

export const metadata: Metadata = {
  title: "Prudhvi Varma",
  description: "Developer building secure systems, edge networks, and things that break on purpose.",
};

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
