"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale; // Replace the locale segment
    return segments.join("/");
  };

  return (
    <div>
      <Link href={switchLocale("en")}>English</Link> |{" "}
      <Link href={switchLocale("th")}>ไทย</Link>
    </div>
  );
}
