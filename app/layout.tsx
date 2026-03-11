import type { Metadata } from "next";
import { Syne, Fira_Code, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider }    from "@/components/ThemeProvider";
import { Navbar }           from "@/components/Navbar";
import { ScrollReset }      from "@/components/ScrollReset";
import { ScrollAnimations } from "@/components/ScrollAnimations";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prudhvi Varma",
  description: "Cybersecurity engineer and full-stack developer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${firaCode.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Runs before paint — prevents browser from restoring any scroll position */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              history.scrollRestoration="manual";
              if(window.location.hash){history.replaceState(null,"",window.location.pathname);}
              window.scrollTo(0,0);
            `,
          }}
        />
      </head>
      <body>
        <ScrollReset />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollAnimations />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
