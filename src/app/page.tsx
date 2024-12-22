"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
  Link,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

function Main() {
  const searchParams = useSearchParams();
  const title = searchParams.get("tr");
  const artist = searchParams.get("ar");
  const album = searchParams.get("al");
  const albumArtist = searchParams.get("alar");
  const trackNumber = parseInt(searchParams.get("tn") || "0");
  const trackCount = parseInt(searchParams.get("tc") || "0");
  const discNumber = parseInt(searchParams.get("dn") || "0");
  const discCount = parseInt(searchParams.get("dc") || "0");
  const length = searchParams.get("len");
  const genre = searchParams.get("ge");
  const year = searchParams.get("y");
  const language = searchParams.get("lang");
  const related = searchParams.get("rel") || "";
  const customAlbumCover = searchParams.get("cti");
  const spotifyAlbumId = searchParams.get("aref");
  const spotifyTrackId = searchParams.get("tref");
  const spotifyCoverId = searchParams.get("cref");

  const [albumData, setAlbumData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [spotifyEmbed, setSpotifyEmbed] = useState<string>("");
  const [spotifyEmbedOpacity, setSpotifyEmbedOpacity] = useState<number>(0);

  let splitRelated = (related as string).split(";").map((id) => id.trim());

  useEffect(() => {
    const fetchAlbumData = async () => {
      if ((spotifyAlbumId as string) !== "") {
        try {
          const response = await fetch(
            `/api/spotify/getAlbumData?spotifyAlbumId=${spotifyAlbumId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch album data");
          }

          const data = await response.json();
          setAlbumData(data);

          // Set favicon
          const favicon = document.createElement("link");
          favicon.rel = "icon";
          favicon.type = "image/x-icon";

          // Set the cover based on customAlbumCover or albumData
          console.log(customAlbumCover);
          if (customAlbumCover) {
            console.log;
            setCover(customAlbumCover);
            favicon.href = customAlbumCover;
          } else if (data?.images?.[0]?.url) {
            setCover(data.images[0].url);
            favicon.href = data.images[0].url; // Replace with your favicon URL
          }

          document.head.appendChild(favicon);

          // Set background image
          const bg = document.getElementById("background") as HTMLDivElement;
          bg.style.backgroundImage = `url(${data.images[0].url})`;

          if (discCount != 1) {
            let trackData;
            for (let i = 0; i <= data.tracks.items.length - 1; i++) {
              if (
                data.tracks.items[i].disc_number == discNumber &&
                data.tracks.items[i].track_number == trackNumber
              ) {
                trackData = data.tracks.items[i];
                setSpotifyEmbed(
                  `https://open.spotify.com/embed/track/${trackData.id}`
                );
                setTimeout(() => {
                  setSpotifyEmbedOpacity(1);
                }, 1000);
              }
            }
          } else {
            setSpotifyEmbed(
              `https://open.spotify.com/embed/track/${data.tracks.items[trackNumber - 1].id}`
            );
            setTimeout(() => {
              setSpotifyEmbedOpacity(1);
            }, 1000);
          }
        } catch (err: any) {
          setError(err.message);
        }
      } else if (customAlbumCover) {
        setCover(customAlbumCover);
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/x-icon";
        favicon.href = customAlbumCover;
        document.head.appendChild(favicon);
        const bg = document.getElementById("background") as HTMLDivElement;
        bg.style.backgroundImage = `url(${customAlbumCover})`;
      } else if ((spotifyCoverId as string) !== "") {
        try {
          const response = await fetch(
            `/api/spotify/getAlbumData?spotifyAlbumId=${spotifyCoverId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch album data");
          }

          const data = await response.json();
          console.log(data);
          setAlbumData(data);

          // Set favicon
          const favicon = document.createElement("link");
          favicon.rel = "icon";
          favicon.type = "image/x-icon";
          favicon.href = data.images[0].url; // Replace with your favicon URL
          document.head.appendChild(favicon);
          setCover(data.images[0].url);

          // Set background image
          const bg = document.getElementById("background") as HTMLDivElement;
          bg.style.backgroundImage = `url(${data.images[0].url})`;
        } catch (err: any) {
          setError(err.message);
        }
      }

      if ((spotifyTrackId as string) !== "") {
        setSpotifyEmbed(
          `https://open.spotify.com/embed/track/${spotifyTrackId}`
        );
        setTimeout(() => {
          setSpotifyEmbedOpacity(1);
        }, 1000);
      }
    };

    fetchAlbumData();
  }, [spotifyAlbumId, customAlbumCover, spotifyEmbedOpacity]);

  return (
    <div style={{ padding: "0 20px" }}>
      <div id="background" className="bg" />
      {spotifyEmbed ? (
        <div
          id="spotify-embed"
          style={{
            opacity: spotifyEmbedOpacity,
            height: spotifyEmbedOpacity == 1 ? "50px" : "0px",
          }}
          className={
            spotifyEmbedOpacity == 1 ? "animate__animated animate__zoomIn" : ""
          }
        >
          <iframe
            id="spotify-embed-iframe"
            title="Spotify-Embed"
            src={spotifyEmbed}
            height={"200"}
            allow="encrypted-media"
          />
        </div>
      ) : null}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          paddingTop: spotifyEmbedOpacity == 1 ? "150px" : "0px",
          transition: "all .5s ease-in-out",
        }}
      >
        <Card className="max-w-[400px]" isBlurred radius="lg">
          <CardHeader className="flex gap-3 justify-center">
            {cover ? (
              <Link href={cover} target="_blank">
                <Image
                  id="album-cover"
                  alt="nextui logo"
                  radius="sm"
                  src={cover as string}
                  width={800}
                  isBlurred
                />
              </Link>
            ) : (
              <Spinner size="lg" />
            )}
          </CardHeader>
          <Divider />
          <CardBody>
            <div
              style={{
                textAlign: "center",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {title}
            </div>
            <div style={{ textAlign: "center" }}>{artist}</div>
          </CardBody>
          <Divider />
          <CardFooter>
            <table id="meta-table">
              <tbody>
                <tr>
                  <td>Title</td>
                  <td>
                    <Link
                      href={"https://www.google.com/search?q=" + title}
                      target="_blank"
                    >
                      {title}
                    </Link>
                  </td>
                  <td>
                    <Button
                      color="primary"
                      onPress={(event) => {
                        navigator.clipboard.writeText(title as string);
                        const button = event.target as HTMLButtonElement;
                        button.innerText = "Copied";
                        setTimeout(() => {
                          button.innerText = "Copy";
                        }, 1000);
                      }}
                    >
                      Copy
                    </Button>
                  </td>
                </tr>
                {artist != "Various Artists" ? (
                  <tr>
                    <td>Artist</td>
                    <td>
                      <Link
                        href={"https://www.google.com/search?q=" + artist}
                        target="_blank"
                      >
                        {artist}
                      </Link>
                    </td>
                    <td>
                      <Button
                        color="primary"
                        onPress={(event) => {
                          navigator.clipboard.writeText(artist as string);
                          const button = event.target as HTMLButtonElement;
                          button.innerText = "Copied";
                          setTimeout(() => {
                            button.innerText = "Copy";
                          }, 1000);
                        }}
                      >
                        Copy
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>Artist</td>
                    <td>{artist}</td>
                    <td>
                      <Button
                        color="default"
                        disabled
                        style={{ pointerEvents: "none" }}
                      >
                        Copy
                      </Button>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Album</td>
                  <td>
                    <Link
                      href={"https://www.google.com/search?q=" + album}
                      target="_blank"
                    >
                      {album}
                    </Link>
                  </td>
                  <td>
                    <Button
                      color="primary"
                      onPress={(event) => {
                        navigator.clipboard.writeText(album as string);
                        const button = event.target as HTMLButtonElement;
                        button.innerText = "Copied";
                        setTimeout(() => {
                          button.innerText = "Copy";
                        }, 1000);
                      }}
                    >
                      Copy
                    </Button>
                  </td>
                </tr>
                {albumArtist != "Various Artists" ? (
                  <tr>
                    <td>Album Artist</td>
                    <td>
                      <Link
                        href={"https://www.google.com/search?q=" + artist}
                        target="_blank"
                      >
                        {artist}
                      </Link>
                    </td>
                    <td>
                      <Button
                        color="primary"
                        onPress={(event) => {
                          navigator.clipboard.writeText(albumArtist as string);
                          const button = event.target as HTMLButtonElement;
                          button.innerText = "Copied";
                          setTimeout(() => {
                            button.innerText = "Copy";
                          }, 1000);
                        }}
                      >
                        Copy
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>Album Artist</td>
                    <td>{albumArtist}</td>
                    <td>
                      <Button
                        color="default"
                        disabled
                        style={{ pointerEvents: "none" }}
                      >
                        Copy
                      </Button>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Disc</td>
                  <td colSpan={2}>
                    {`${discNumber == 0 ? "Unknown" : discNumber}/${
                      discCount == 0 ? "Unknown" : discCount
                    }`}
                  </td>
                </tr>
                <tr>
                  <td>Track</td>
                  <td
                    colSpan={2}
                  >{`${trackNumber == 0 ? "Unknown" : trackNumber}/${trackCount == 0 ? "Unknown" : trackCount}`}</td>
                </tr>
                <tr>
                  <td>Length</td>
                  <td colSpan={2}>{length}</td>
                </tr>
                <tr>
                  <td>Genre</td>
                  <td colSpan={2}>{genre}</td>
                </tr>
                <tr>
                  <td>Year</td>
                  <td colSpan={2}>{year}</td>
                </tr>
                <tr>
                  <td>Language</td>
                  <td colSpan={2}>{language}</td>
                </tr>
                <tr>
                  <td>Related</td>
                  <td colSpan={2}>
                    {splitRelated.map((relatedItem, index) => (
                      <span key={index}>
                        <Link
                          href={
                            "https://www.google.com/search?q=" + relatedItem
                          }
                          target="_blank"
                        >
                          #{relatedItem}
                        </Link>
                        {index < splitRelated.length - 1 &&
                          "\u00A0\u00A0\u00A0"}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
