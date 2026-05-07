import type { Metadata } from "next";
import "./globals.css";
import { ScrollReset } from "@/components/ScrollReset";

export const metadata: Metadata = {
  title: "Prudhvi Varma",
  description: "Cybersecurity engineer and full-stack developer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              history.scrollRestoration="manual";
              if(window.location.hash){history.replaceState(null,"",window.location.pathname);}
              window.scrollTo(0,0);
              var t=localStorage.getItem("portfolio-theme");
              if(t)document.documentElement.setAttribute("data-theme",t);
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
