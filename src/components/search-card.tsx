"use client";

import { Button, Card, CardFooter, Image } from "@nextui-org/react";

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
  return (
    <div className="p-3" style={{ minWidth: "300px" }}>
      <Card
        className="card"
        isFooterBlurred
        isPressable
        isHoverable
        onPress={() => window.open(trackURL + track, "_blank")}
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
