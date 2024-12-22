import "@/src/styles/globals.css";
import "@/src/styles/background.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { fontSans } from "@/src/config/fonts";
import { ThemeSwitch } from "@/src/components/theme-switch";

export const metadata: Metadata = {
  title: {
    default: "Track Information",
    template: "Track Information",
  },
  description: "Track Information",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div>
            <div style={{ textAlign: "right" }}>
              <ThemeSwitch className="p-3" />
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
