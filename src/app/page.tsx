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
  Alert,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import SearchCard from "../components/search-card";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import NoSsr from "../components/no-ssr";
import React from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

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
  const alternatTitle = searchParams.get("atr") || "";
  const customAlbumCover = searchParams.get("cti");
  const spotifyAlbumId = searchParams.get("aref");
  const spotifyTrackId = searchParams.get("tref");
  const spotifyCoverId = searchParams.get("cref");
  const youtubeVideoId = searchParams.get("v") || null;

  const [albumData, setAlbumData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [spotifyEmbed, setSpotifyEmbed] = useState<string>("");
  const [spotifyAlbumEmbed, setSpotifyAlbumEmbed] = useState<string>("");
  const [spotifyEmbedOpacity, setSpotifyEmbedOpacity] = useState<number>(0);
  const [searchWarning, setSearchWarning] = useState<boolean>(false);
  const [spotifyAlbumName, setSpotifyAlbumName] = useState<string>("");
  const [spotifyTrackName, setSpotifyTrackName] = useState<string>("");
  const [spotifyTrackUrl, setSpotifyTrackUrl] = useState<string>("");
  const [spotifyAlbumEmbedHeight, setSpotifyAlbumEmbedHeight] =
    useState<number>(0);

  const {
    isOpen: isSpotifyAlbumOpen,
    onOpen: onSpotifyAlbumOpen,
    onOpenChange: onSpotifyAlbumOpenChange,
  } = useDisclosure();

  const { setTheme, theme } = useTheme();
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;

  const [isVisible, setIsVisible] = React.useState(false);
  const [alertClass, setAlertClass] = React.useState("aminimate__fadeInUp");
  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");

  const alertTimeout = React.useRef<number | null>(null);
  const alertAnimateTimeout = React.useRef<number | null>(null);
  const displayAlert = () => {
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }
    if (alertAnimateTimeout.current) {
      clearTimeout(alertAnimateTimeout.current);
    }
    setAlertClass("animate__fadeInUp");
    setIsVisible(true);
    alertTimeout.current = window.setTimeout(() => {
      setAlertClass("animate__fadeOutDown");
      alertAnimateTimeout.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }, 3000);
  };

  let splitRelated = (related as string).split(";").map((id) => id.trim());
  const artistArray = artist
    .split(
      /(?:feat\.|meets|×|with|cv\.|Cv\.|CV\.|cv:|Cv:|CV:|cv |Cv |CV |va\.|Va\.|VA\.|va:|Va:|VA:|va |Va |VA |vo\.|Vo\.|VO\.|vo:|Vo:|VO:|vo |Vo |VO |&|\(\s*|\s*\)|\[|\]|,)/g
    )
    .filter((artist) => artist.trim() !== "")
    .map((artist) => artist.trim());

  const alternatTitleArray = alternatTitle!
    .split(";")
    .filter((title) => title.trim() !== "")
    .map((title) => title.trim());

  const coverManager = (url: string) => {
    setCover(url);
    setBackground(`url(${url})`);
    const bg = document.getElementById("background") as HTMLDivElement;
    bg.style.backgroundImage = `url(${url})`;
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/jpg";
    favicon.href = url;
    const oldFavicon = document.querySelector("link[rel='icon']");
    if (oldFavicon) {
      document.head.removeChild(oldFavicon);
    }
    document.head.appendChild(favicon);

    document.title = `${title} - ${artist}`;
  };

  useEffect(() => {
    const fetchAlbumData = async () => {
      let albumCover;
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
          setSpotifyAlbumName(data.name);

          // Set the cover based on customAlbumCover or albumData
          if (customAlbumCover) {
            coverManager(customAlbumCover);
            albumCover = customAlbumCover;
          } else if (data?.images?.[0]?.url) {
            coverManager(data.images[0].url);
            albumCover = data.images[0].url;
          }

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
                setSpotifyAlbumEmbed(
                  `https://open.spotify.com/embed/album/${data.id}`
                );
                setSpotifyAlbumEmbedHeight(data.tracks.items.length * 51 + 220);
                setSpotifyTrackName(trackData.name);
                setSpotifyTrackUrl(trackData.external_urls.spotify);
                setTimeout(() => {
                  setSpotifyEmbedOpacity(1);
                }, 1000);
              }
            }
          } else {
            setSpotifyEmbed(
              `https://open.spotify.com/embed/track/${data.tracks.items[trackNumber - 1].id}`
            );
            setSpotifyAlbumEmbed(
              `https://open.spotify.com/embed/album/${data.id}`
            );
            setSpotifyAlbumEmbedHeight(data.tracks.items.length * 51 + 220);
            setSpotifyTrackName(data.tracks.items[trackNumber - 1].name);
            setSpotifyTrackUrl(
              data.tracks.items[trackNumber - 1].external_urls.spotify
            );
            setTimeout(() => {
              setSpotifyEmbedOpacity(1);
            }, 1000);
          }
          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title,
              artist,
              album,
              artwork: [
                {
                  src: albumCover,
                  sizes: "256x256",
                  type: "image/jpg",
                },
              ],
            });
          }
        } catch (err: any) {
          setError(err.message);
        }
      } else if (customAlbumCover) {
        coverManager(customAlbumCover);
        albumCover = customAlbumCover;
      } else if ((spotifyCoverId as string) !== "") {
        try {
          const response = await fetch(
            `/api/spotify/getAlbumData?spotifyAlbumId=${spotifyCoverId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch album data");
          }

          const data = await response.json();
          setAlbumData(data);
          setSpotifyAlbumName(data.name);

          coverManager(data.images[0].url);
          albumCover = data.images[0].url;
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
        setAlbumData(data);
        coverManager(data.albums.items[0].images[0].url);
        albumCover = data.albums.items[0].images[0].url;
        setSearchWarning(true);
      }

      if ((spotifyTrackId as string) !== "") {
        setSpotifyEmbed(
          `https://open.spotify.com/embed/track/${spotifyTrackId}`
        );
        const response = await fetch(
          `/api/spotify/getTrackData?spotifyTrackId=${spotifyTrackId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch album data");
        }
        const data = await response.json();
        setSpotifyTrackName(data.name);
        setSpotifyTrackUrl(data.external_urls.spotify);
        setTimeout(() => {
          setSpotifyEmbedOpacity(1);
        }, 1000);
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist,
            album,
            artwork: [
              {
                src: albumCover,
                sizes: "256x256",
                type: "image/jpg",
              },
            ],
          });
        }
      }
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
          style={{
            overflow: "hidden",
            backgroundColor: isDarkMode
              ? "hsla(0,0%,0%,.8)"
              : "hsla(0,0%,100%,.8)",
            height: "100%",
            width: "100%",
          }}
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
      <div className="flex flex-col gap-4">
        {isVisible ? (
          <div
            className={`alert animate__animated ${alertClass} animate__faster`}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "15px",
                }}
              />
              <Alert
                color="success"
                description={alertMessage}
                isVisible={isVisible}
                title={`${t("copied")} ${alertTitle}`}
                variant="faded"
                onClose={() => setIsVisible(false)}
                style={{
                  backdropFilter: "blur(10px)",
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      {spotifyEmbed ? (
        <div
          id="spotify-embed"
          style={{
            opacity: spotifyEmbedOpacity,
            height: spotifyEmbedOpacity == 1 ? "50px" : "0px",
          }}
          className={
            "main-container " +
            (spotifyEmbedOpacity == 1
              ? "animate__animated animate__zoomIn"
              : "")
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
        className="main-container"
        style={{
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
                <div className="album-cover-container animate__animated animate__zoomInDown">
                  <Link
                    href={`/cover?src=${cover}&desc=${title} - ${artist}`}
                    target="_blank"
                  >
                    <Image
                      className="album-cover"
                      alt="cover"
                      radius="sm"
                      src={cover as string}
                      width={700}
                      isBlurred
                    />
                  </Link>
                  {searchWarning ? (
                    <div
                      style={{
                        position: "absolute",
                        right: "6.2%",
                        bottom: "6.7%",
                        zIndex: 50,
                      }}
                      className="animate__animated animate__bounceIn animate__delay-1s"
                    >
                      <Tooltip
                        placement="left"
                        showArrow
                        content={
                          <div className="px-1 py-2">
                            <div className="text-small font-bold">
                              {t("warning")}
                            </div>
                            <div className="text-tiny">
                              {t("search_warning")}
                            </div>
                          </div>
                        }
                      >
                        <div
                          className="bg-background px-2 py-3"
                          style={{ borderRadius: "30%" }}
                        >
                          <i className="fa-solid fa-circle-info fa-2xl animate__animated animate__zoomIn animate__delay-1s" />
                        </div>
                      </Tooltip>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-3">
                  <Spinner size="lg" />
                </div>
              )}
            </CardHeader>
            {/* <Divider /> */}
            <CardBody style={{ overflow: "visible" }}>
              <div className="header-title">
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "32px",
                    fontWeight: "bold",
                    overflow: "hidden",
                  }}
                >
                  {title}
                </div>
                <div style={{ textAlign: "center", overflow: "hidden" }}>
                  {artist}
                </div>
              </div>
            </CardBody>
            <div className="px-3">
              <Divider />
            </div>
            <CardFooter>
              <div className="w-full">
                <table id="meta-table">
                  <tbody>
                    <tr className="expandable-row">
                      <td>{t("title")}</td>
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
                            displayAlert();
                            setAlertTitle(t("title"));
                            setAlertMessage(title);
                          }}
                        >
                          {t("copy")}
                        </Button>
                      </td>
                    </tr>
                    {!spotifyTrackName && alternatTitle ? (
                      <tr className="expandable-row alt-row">
                        <td>└─ &nbsp; {t("alt_title")}</td>
                        <td colSpan={2}>
                          {alternatTitleArray.map((item, index) => (
                            <span key={index}>
                              <Link
                                className="expandable-row alt-row"
                                href={"https://www.google.com/search?q=" + item}
                                target="_blank"
                                underline="hover"
                              >
                                {item}
                              </Link>
                              {index !== alternatTitleArray.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ) : null}
                    {spotifyTrackName && !alternatTitle ? (
                      spotifyTrackName.toLowerCase().replaceAll(" ", "") !=
                      title.toLowerCase().replaceAll(" ", "") ? (
                        <tr className="expandable-row alt-row">
                          <td>└─ &nbsp; {t("alt_title")}</td>
                          <td colSpan={2}>
                            <Link
                              href={
                                "https://www.google.com/search?q=" +
                                spotifyTrackName
                              }
                              target="_blank"
                              underline="hover"
                            >
                              {spotifyTrackName}
                            </Link>
                          </td>
                        </tr>
                      ) : null
                    ) : null}
                    {spotifyTrackName && alternatTitle ? (
                      <tr className="expandable-row alt-row">
                        <td>└─ &nbsp; {t("alt_title")}</td>
                        <td colSpan={2}>
                          {alternatTitleArray.map((item, index) => (
                            <span key={index}>
                              <Link
                                className="expandable-row alt-row"
                                href={"https://www.google.com/search?q=" + item}
                                target="_blank"
                                underline="hover"
                              >
                                {item}
                              </Link>
                              {index !== alternatTitleArray.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                          {spotifyTrackName.toLowerCase().replaceAll(" ", "") !=
                          title.toLowerCase().replaceAll(" ", "") ? (
                            <span>
                              ,&nbsp;
                              <Link
                                href={
                                  "https://www.google.com/search?q=" +
                                  spotifyTrackName
                                }
                                target="_blank"
                                underline="hover"
                              >
                                {spotifyTrackName}
                              </Link>
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    ) : null}
                    {artist != "Various Artists" ? (
                      <tr className="expandable-row">
                        <td>{t("artist")}</td>
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
                              displayAlert();
                              setAlertTitle(t("artist"));
                              setAlertMessage(artist);
                            }}
                          >
                            {t("copy")}
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr className="expandable-row">
                        <td>Artist</td>
                        <td>{artist}</td>
                        <td>
                          <Button
                            color="default"
                            disabled
                            style={{ pointerEvents: "none" }}
                          >
                            {t("copy")}
                          </Button>
                        </td>
                      </tr>
                    )}
                    {artistArray.length > 1 ? (
                      <tr className="expandable-row alt-row">
                        <td>
                          <span id="contain-artist">
                            └─ &nbsp; {t("contain_artists")}
                          </span>
                        </td>
                        <td colSpan={2}>
                          {artistArray.map((item, index) => (
                            <span key={index}>
                              <Link
                                className="expandable-row alt-row"
                                href={
                                  "https://www.google.com/search?q=" +
                                  item +
                                  " - artist"
                                }
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
                    <tr className="expandable-row">
                      <td>
                        {t("album")}{" "}
                        {spotifyAlbumEmbed ? (
                          <Button
                            isIconOnly
                            color="success"
                            variant="shadow"
                            onPress={onSpotifyAlbumOpen}
                            className="animate__animated animate__zoomIn"
                          >
                            <i className="fa-brands fa-spotify fa-xl"></i>
                          </Button>
                        ) : null}
                      </td>
                      <td>
                        <Link
                          href={
                            "https://www.google.com/search?q=" +
                            album +
                            " - album"
                          }
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
                            displayAlert();
                            setAlertTitle(t("album"));
                            setAlertMessage(album);
                          }}
                        >
                          {t("copy")}
                        </Button>
                      </td>
                    </tr>
                    {spotifyAlbumName ? (
                      spotifyAlbumName.toLowerCase().replaceAll(" ", "") !=
                      album.toLowerCase().replaceAll(" ", "") ? (
                        <tr className="expandable-row alt-row">
                          <td>└─ &nbsp; {t("alt_album")}</td>
                          <td colSpan={2}>
                            <Link
                              className="expandable-row alt-row"
                              href={
                                "https://www.google.com/search?q=" +
                                albumData.name +
                                " - album"
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
                      <tr className="expandable-row">
                        <td>{t("album_artist")}</td>
                        <td>
                          <Link
                            href={
                              "https://www.google.com/search?q=" +
                              albumArtist +
                              " - artist"
                            }
                            target="_blank"
                            underline="hover"
                          >
                            {albumArtist}
                          </Link>
                        </td>
                        <td>
                          <Button
                            color="primary"
                            onPress={(event) => {
                              navigator.clipboard.writeText(
                                albumArtist as string
                              );
                              displayAlert();
                              setAlertTitle(t("album_artist"));
                              setAlertMessage(albumArtist);
                            }}
                          >
                            {t("copy")}
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr className="expandable-row">
                        <td>Album Artist</td>
                        <td>{albumArtist}</td>
                        <td>
                          <Button
                            color="default"
                            disabled
                            style={{ pointerEvents: "none" }}
                          >
                            {t("copy")}
                          </Button>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>{t("disc")}</td>
                      <td colSpan={2}>
                        {`${discNumber == 0 ? "Unknown" : discNumber}/${
                          discCount == 0 ? "Unknown" : discCount
                        }`}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("track")}</td>
                      <td
                        colSpan={2}
                      >{`${trackNumber == 0 ? "Unknown" : trackNumber}/${trackCount == 0 ? "Unknown" : trackCount}`}</td>
                    </tr>
                    <tr>
                      <td>{t("length")}</td>
                      <td colSpan={2}>{length}</td>
                    </tr>
                    <tr>
                      <td>{t("genre")}</td>
                      <td colSpan={2}>{genre}</td>
                    </tr>
                    <tr>
                      <td>{t("year")}</td>
                      <td colSpan={2}>{year}</td>
                    </tr>
                    <tr>
                      <td>{t("language")}</td>
                      <td colSpan={2}>{language}</td>
                    </tr>
                    <tr>
                      <td>{t("related")}</td>
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
                  />
                  <SearchCard
                    searchProvider="YouTube"
                    image="/youtube.jpg"
                    padding="0px"
                    textWhite={false}
                    track={title + " " + artist}
                    trackURL="https://www.youtube.com/results?search_query="
                    isDirectURL={youtubeVideoId != null}
                    directURL={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                  />
                  <SearchCard
                    searchProvider="Spotify"
                    image="/spotify.jpg"
                    padding="0px"
                    textWhite={true}
                    track={title + " " + artist}
                    trackURL="https://open.spotify.com/search/"
                    isDirectURL={
                      spotifyTrackUrl != null &&
                      spotifyTrackUrl != "" &&
                      spotifyTrackUrl != undefined
                    }
                    directURL={spotifyTrackUrl}
                  />
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
        {spotifyAlbumEmbed != "" || spotifyAlbumEmbed != null ? (
          <Modal
            isOpen={isSpotifyAlbumOpen}
            onOpenChange={onSpotifyAlbumOpenChange}
            backdrop="blur"
            size="2xl"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            style={{ userSelect: "none" }}
            scrollBehavior="inside"
            // hideCloseButton
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {album}
                  </ModalHeader>
                  <ModalBody style={{ position: "relative" }}>
                    <Spinner
                      size="lg"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        translate: "-50% -50%",
                      }}
                      className="animate__animated animate__zoomOut animate__delay-2s"
                    />
                    <iframe
                      id="spotify-album-embed-iframe"
                      title="Spotify-Album-Embed"
                      className="animate__animated animate__zoomIn animate__delay-1s"
                      src={spotifyAlbumEmbed}
                      style={{ height: spotifyAlbumEmbedHeight + "px" }}
                      height="100%"
                      allow="encrypted-media"
                    />
                  </ModalBody>
                  <ModalFooter>
                    {/* <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button> */}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        ) : null}
      </div>
    </div>
  );
}
