// components/LanguageSwitcher.tsx
"use client";

import { useState } from "react";
import Cookie from "js-cookie";
import { Card, CardBody } from "@nextui-org/react";
import { useTheme } from "next-themes";

const LanguageSwitcher = () => {
  const [locale, setLocale] = useState<string>(
    Cookie.get("NEXT_LOCALE") || "en"
  );
  const { setTheme, theme } = useTheme();
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;

  const handleLocaleChange = (newLocale: string) => {
    // Set the cookie for the new locale
    Cookie.set("NEXT_LOCALE", newLocale, { expires: 365, path: "/" });

    // Update the state
    setLocale(newLocale);

    // Reload the page to apply the new locale
    window.location.reload();
  };

  return (
    <div className="px-3">
      <Card
        isBlurred
        isPressable
        onPress={() => handleLocaleChange(locale === "en" ? "th" : "en")}
        style={{
          pointerEvents: "all",
          backgroundColor: isDarkMode
            ? "hsla(0,0%,0%,.8)"
            : "hsla(0,0%,100%,.8)",
          padding: "0px",
        }}
      >
        <CardBody style={{ padding: "0px 12px" }}>
          {locale === "en" ? "TH" : "EN"}
        </CardBody>
      </Card>
    </div>
  );
};

export default LanguageSwitcher;
