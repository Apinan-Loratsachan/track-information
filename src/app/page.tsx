"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const tr = searchParams.get("tr");

  useEffect(() => {
    const bg = document.getElementById("background") as HTMLDivElement;
    bg.style.backgroundImage =
      "url(https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg)";
  });
  return (
    <div>
      <div id="background" className="bg"></div>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <Card className="max-w-[400px]" isBlurred>
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">NextUI</p>
              <p className="text-small text-default-500">nextui.org</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Make beautiful websites regardless of your design experience.</p>
          </CardBody>
          <Divider />
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href="https://github.com/nextui-org/nextui"
            >
              Visit source code on GitHub.
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
