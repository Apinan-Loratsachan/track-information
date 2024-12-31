"use client";

import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export default function NotFound() {
  const { setTheme, theme } = useTheme();
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;
  const t = useTranslations();
  return (
    <div className="flex items-center justify-center">
      <Card
        className="card m-auto"
        isBlurred
        shadow="lg"
        style={{
          overflow: "hidden",
          backgroundColor: isDarkMode
            ? "hsla(0,0%,0%,.8)"
            : "hsla(0,0%,100%,.8)",
          height: "100%",
          width: "100%",
        }}
      >
        <CardHeader className="justify-center">
          <div className="text-center">
            <b style={{ fontSize: "50px" }}>404</b>
            <p>
              <b>Page Not Found</b>
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="text-center justify-center items-center">
          {t("404")}
        </CardBody>
      </Card>
    </div>
  );
}
