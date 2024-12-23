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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import SearchCard from "../components/search-card";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import NoSsr from "../components/no-ssr";

const BackgroundOverlay = dynamic(
  () => import("../components/background-overlay"),
  { ssr: false }
);

export default function Home() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

function Main() {
  const searchParams = useSearchParams();
  const title = searchParams.get("tr") || "Unknown";
  const artist = searchParams.get("ar") || "Unknown";
  const album = searchParams.get("al") || "Unknown";
  const albumArtist = searchParams.get("alar") || "Unknown";
  const trackNumber = parseInt(searchParams.get("tn") || "0");
  const trackCount = parseInt(searchParams.get("tc") || "0");
  const discNumber = parseInt(searchParams.get("dn") || "0");
  const discCount = parseInt(searchParams.get("dc") || "0");
  const length = searchParams.get("len") || "Unknown";
  const genre = searchParams.get("ge") || "Unknown";
  const year = searchParams.get("y") || "Unknown";
  const language = searchParams.get("lang") || "Unknown";
  const related = searchParams.get("rel") || "";
  const customAlbumCover = searchParams.get("cti");
  const spotifyAlbumId = searchParams.get("aref");
  const spotifyTrackId = searchParams.get("tref");
  const spotifyCoverId = searchParams.get("cref");

  const [albumData, setAlbumData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [spotifyEmbed, setSpotifyEmbed] = useState<string>("");
  const [spotifyEmbedOpacity, setSpotifyEmbedOpacity] = useState<number>(0);
  const [searchWarning, setSearchWarning] = useState<boolean>(false);

  const { setTheme, theme } = useTheme();
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;

  let splitRelated = (related as string).split(";").map((id) => id.trim());
  const artistArray = artist
    .split(
      /(?:feat\.|meets|×|with|cv\.|Cv\.|CV\.|cv:|Cv:|CV:|cv |Cv |CV |va\.|Va\.|VA\.|va:|Va:|VA:|va |Va |VA |vo\.|Vo\.|VO\.|vo:|Vo:|VO:|vo |Vo |VO |&|\(\s*|\s*\)|\[|\]|,)/g
    )
    .filter((artist) => artist.trim() !== "")
    .map((artist) => artist.trim());

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

          // Set background image
          const bg = document.getElementById("background") as HTMLDivElement;

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
            setBackground(`url(${customAlbumCover})`);
          } else if (data?.images?.[0]?.url) {
            setCover(data.images[0].url);
            favicon.href = data.images[0].url;
            setBackground(`url(${data.images[0].url})`);
          }

          document.head.appendChild(favicon);

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
        setBackground(`url(${customAlbumCover})`);
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
          setBackground(`url(${data.images[0].url})`);
        } catch (err: any) {
          setError(err.message);
        }
      } else {
        const response = await fetch(
          `/api/spotify/search?search=${album} ${albumArtist}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch album data");
        }
        const data = await response.json();
        console.log(data);
        setAlbumData(data);
        setCover(data.albums.items[0].images[0].url);
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/x-icon";
        favicon.href = data.albums.items[0].images[0].url; // Replace with your favicon URL
        document.head.appendChild(favicon);
        const bg = document.getElementById("background") as HTMLDivElement;
        setBackground(`url(${data.albums.items[0].images[0].url})`);
        setSearchWarning(true);
      }

      if ((spotifyTrackId as string) !== "") {
        setSpotifyEmbed(
          `https://open.spotify.com/embed/track/${spotifyTrackId}`
        );
        setTimeout(() => {
          setSpotifyEmbedOpacity(1);
        }, 1000);
      }
      console.log(albumData);
    };

    fetchAlbumData();
  }, [spotifyAlbumId, customAlbumCover, spotifyEmbedOpacity]);

  if (
    searchParams.get("tr") === null ||
    searchParams.get("ar") === null ||
    searchParams.get("al") === null
  ) {
    return (
      <div className="flex justify-center">
        <Card
          className="card m-auto"
          isBlurred
          shadow="lg"
          style={{ height: "100%", width: "100%" }}
        >
          <CardHeader>
            <h1 style={{ fontWeight: "bold" }}>Missing parameters</h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <p style={{ fontWeight: "bold" }}>
              Require parameters are missing:
            </p>
            <p>
              tr :{" "}
              {searchParams.get("tr") == null ? (
                <b style={{ color: "red" }}>Missing</b>
              ) : (
                <b style={{ color: "green" }}>Present</b>
              )}
            </p>
            <p>
              ar :{" "}
              {searchParams.get("ar") == null ? (
                <b style={{ color: "red" }}>Missing</b>
              ) : (
                <b style={{ color: "green" }}>Present</b>
              )}
            </p>
            <p>
              al :{" "}
              {searchParams.get("al") == null ? (
                <b style={{ color: "red" }}>Missing</b>
              ) : (
                <b style={{ color: "green" }}>Present</b>
              )}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px" }}>
      {background != "" || background != null ? (
        <div>
          <div
            id="background"
            className="bg animate__animated animate__fadeIn animate__delay-1s"
            style={{ backgroundImage: background as string }}
          />
          <BackgroundOverlay isDarkMode={isDarkMode} />
        </div>
      ) : null}
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
            height={"152px"}
            allow="encrypted-media"
            style={{ borderRadius: "15px" }}
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
        <NoSsr>
          <Card
            className="max-w-[400px]"
            isBlurred
            shadow="lg"
            radius="lg"
            style={{
              overflow: "hidden",
              backgroundColor: isDarkMode
                ? "hsla(0,0%,0%,.8)"
                : "hsla(0,0%,100%,.8)",
            }}
          >
            <CardHeader className="flex gap-3 justify-center">
              {cover ? (
                <div
                  style={{ position: "relative" }}
                  className="animate__animated animate__zoomInDown"
                >
                  <Link href={cover} target="_blank">
                    <Image
                      id="album-cover"
                      alt="cover"
                      radius="sm"
                      src={cover as string}
                      width={775}
                      isBlurred
                    />
                  </Link>
                  {searchWarning ? (
                    <div
                      style={{
                        position: "absolute",
                        right: 10,
                        bottom: 0,
                        zIndex: 50,
                      }}
                      className="animate__animated animate__fadeIn animate__delay-1s"
                    >
                      <Popover placement="left" showArrow>
                        <PopoverTrigger>
                          <Button isIconOnly>
                            <i className="fa-solid fa-circle-info fa-2xl" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="px-1 py-2">
                            <div className="text-small font-bold">Warning</div>
                            <div className="text-tiny">
                              This cover is from a search result. It may not be
                              the actual cover of the album.
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Spinner size="lg" />
              )}
            </CardHeader>
            {/* <Divider /> */}
            <CardBody style={{ overflow: "hidden" }}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  overflow: "hidden",
                }}
                className="animate__animated animate__bounceIn delay-025"
              >
                {title}
              </div>
              <div
                style={{ textAlign: "center", overflow: "hidden" }}
                className="animate__animated animate__fadeInDown delay-075"
              >
                {artist}
              </div>
            </CardBody>
            <div className="px-3">
              <Divider />
            </div>
            <CardFooter>
              <div className="w-full">
                <table id="meta-table">
                  <tbody>
                    <tr>
                      <td>Title</td>
                      <td>
                        <Link
                          href={"https://www.google.com/search?q=" + title}
                          target="_blank"
                          underline="hover"
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
                            underline="hover"
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
                    {artistArray.length > 1 ? (
                      <tr className="alt-row">
                        <td>└─ &nbsp; Contain Artists</td>
                        <td colSpan={2}>
                          {artistArray.map((item, index) => (
                            <span key={index}>
                              <Link
                                className="alt-row"
                                href={"https://www.google.com/search?q=" + item}
                                target="_blank"
                                underline="hover"
                              >
                                {item}
                              </Link>
                              {index !== artistArray.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td>Album</td>
                      <td>
                        <Link
                          href={"https://www.google.com/search?q=" + album}
                          target="_blank"
                          underline="hover"
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
                    {albumData != null ? (
                      albumData.name.toLowerCase() != album.toLowerCase() ? (
                        <tr className="alt-row">
                          <td>└─ &nbsp; Alt Album Name</td>
                          <td colSpan={2}>
                            <Link
                              className="alt-row"
                              href={
                                "https://www.google.com/search?q=" +
                                albumData.name
                              }
                              target={"_blank"}
                              underline="hover"
                            >
                              {albumData.name}
                            </Link>
                          </td>
                        </tr>
                      ) : null
                    ) : null}
                    {albumArtist != "Various Artists" ? (
                      <tr>
                        <td>Album Artist</td>
                        <td>
                          <Link
                            href={"https://www.google.com/search?q=" + artist}
                            target="_blank"
                            underline="hover"
                          >
                            {artist}
                          </Link>
                        </td>
                        <td>
                          <Button
                            color="primary"
                            onPress={(event) => {
                              navigator.clipboard.writeText(
                                albumArtist as string
                              );
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
                        {(splitRelated.length > 1 &&
                          splitRelated.map((relatedItem, index) => (
                            <span key={index}>
                              <Link
                                href={
                                  "https://www.google.com/search?q=" +
                                  relatedItem
                                }
                                target="_blank"
                                underline="hover"
                              >
                                #{relatedItem}
                              </Link>
                              {index < splitRelated.length - 1 &&
                                "\u00A0\u00A0\u00A0"}
                            </span>
                          ))) ||
                        splitRelated[0] === "" ? (
                          "None"
                        ) : (
                          <Link
                            href={
                              "https://www.google.com/search?q=" +
                              splitRelated[0]
                            }
                            target="_blank"
                            underline="hover"
                          >
                            #{splitRelated[0]}
                          </Link>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="py-4">
                  <Divider />
                </div>
                <div className="flex flex-wrap justify-center">
                  <SearchCard
                    searchProvider="Google"
                    image="/google.jpg"
                    padding="0px"
                    textWhite={false}
                    track={title + " " + artist}
                    trackURL="https://www.google.com/search?q="
                  ></SearchCard>
                  <SearchCard
                    searchProvider="YouTube"
                    image="/youtube.jpg"
                    padding="0px"
                    textWhite={false}
                    track={title + " " + artist}
                    trackURL="https://www.youtube.com/results?search_query="
                  ></SearchCard>
                  <SearchCard
                    searchProvider="Spotify"
                    image="/spotify.jpg"
                    padding="0px"
                    textWhite={true}
                    track={title + " " + artist}
                    trackURL="https://open.spotify.com/search/"
                  ></SearchCard>
                  <SearchCard
                    searchProvider="Apple Music"
                    image="/apple_music.jpg"
                    padding="0px"
                    textWhite={true}
                    track={title + " " + artist}
                    trackURL="https://music.apple.com/search?term="
                  />
                </div>
              </div>
            </CardFooter>
          </Card>
        </NoSsr>
      </div>
    </div>
  );
}
