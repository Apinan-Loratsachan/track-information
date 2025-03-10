import "@/src/styles/globals.css";
import "@/src/styles/background.css";
import "@/src/styles/table.css";
import "@/src/styles/cover.css";
import "@/src/styles/spotify.css";
import "@/src/styles/card.css";
import "@/src/styles/animate-delay.css";
import "@/src/styles/text.css";
import "animate.css";
import bg from "../../public/background.jpg";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { fontSans } from "@/src/config/fonts";
import { ThemeSwitch } from "../components/theme-switch";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

// export const metadata: Metadata = {
//   title: {
//     default: "Track Information",
//     template: "Track Information",
//   },
//   description: "Track Information",
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations();
  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <title>{t("website_title")}</title>
        <script
          src="https://kit.fontawesome.com/da71fc72b9.js"
          crossOrigin="anonymous"
        />
      </head>
      <body
        style={{ backgroundImage: `url(${bg.src})` }}
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <div style={{ background: "transparent" }}>
              <ThemeSwitch />
              <div style={{ padding: "50px 0" }} className="select-none">
                {children}
              </div>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
