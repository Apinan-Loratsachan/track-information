"use client";

import { Card, CardFooter, Image } from "@nextui-org/react";
import { useState } from "react";

export default function SearchCard({
  searchProvider,
  track,
  trackURL,
  image,
  padding,
  textWhite,
}: {
  searchProvider: string;
  track: string;
  trackURL: string;
  image: string;
  padding: string;
  textWhite: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="card-container p-3">
      <Card
        className="card"
        isFooterBlurred
        isPressable
        shadow="lg"
        style={{
          boxShadow: isHovered
            ? "10px 10px 15px 0px rgba(0, 0, 0, 0.3)"
            : "10px 10px 30px 0px rgba(0, 0, 0, 0.2)",
        }}
        onPress={() => window.open(trackURL + track, "_blank")}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <Image
          style={{ padding: padding, objectFit: "cover" }}
          alt="Card background"
          //   className="z-0 w-full h-full object-cover"
          height={200}
          src={image}
        />
        <CardFooter
          className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between"
          style={{ height: "40px" }}
        >
          <div>
            <p
              className={`${textWhite ? "text-white" : "text-black"} text-tiny`}
            >{`Search Track on ${searchProvider}`}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
