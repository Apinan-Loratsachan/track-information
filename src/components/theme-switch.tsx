"use client";

import { FC, useEffect, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/src/components/icons";
import LanguageSwitcher from "./language-switch";
import NoSsr from "./no-ssr";
import { Card, CardBody } from "@nextui-org/react";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
    onChange,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Adjust threshold as needed
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 930);
    };

    // Set initial screen size state
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <NoSsr>
      <div
        style={{
          position: "fixed",
          zIndex: 1000,
          width: "100vw",
          display: "flex",
          justifyContent: "end",
          padding: "10px 25px",
          backgroundColor:
            isScrolled && isSmallScreen
              ? isDarkMode
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(255, 255, 255, 0.8)"
              : "transparent",
          transition: "background-color 0.3s ease-in-out",
          pointerEvents: isScrolled && isSmallScreen ? "all" : "none",
        }}
      >
        <LanguageSwitcher />
        <Card
          isBlurred
          style={{
            pointerEvents: "all",
            backgroundColor: isDarkMode
              ? "hsla(0,0%,0%,.8)"
              : "hsla(0,0%,100%,.8)",
          }}
        >
          <CardBody style={{ padding: "1px 1px" }}>
            <Component
              {...getBaseProps({
                className: clsx(
                  "px-px transition-opacity hover:opacity-80 cursor-pointer",
                  className,
                  classNames?.base
                ),
              })}
            >
              <VisuallyHidden>
                <input {...getInputProps()} />
              </VisuallyHidden>
              <div
                {...getWrapperProps()}
                className={slots.wrapper({
                  class: clsx(
                    [
                      "w-auto h-auto",
                      "bg-transparent",
                      "rounded-lg",
                      "flex items-center justify-center",
                      "group-data-[selected=true]:bg-transparent",
                      "!text-default-500",
                      "pt-px",
                      "px-0",
                      "mx-0",
                    ],
                    classNames?.wrapper
                  ),
                })}
              >
                {!isSelected || isSSR ? (
                  <SunFilledIcon size={22} className="text-foreground" />
                ) : (
                  <MoonFilledIcon size={22} className="text-foreground" />
                )}
              </div>
            </Component>
          </CardBody>
        </Card>
      </div>
    </NoSsr>
  );
};
