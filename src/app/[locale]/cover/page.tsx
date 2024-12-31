"use client";

import BackgroundOverlay from "@/src/components/background-overlay";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card, CardBody, Spinner } from "@nextui-org/react";

export default function Cover() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}

function Main() {
  const searchParams = useSearchParams();
  const imageSrc = searchParams.get("src") || null;

  const [background, setBackground] = useState<string | null>(null);
  const [coverState, setCoverState] = useState<boolean>(true);
  const [coverDimention, setCoverDimention] = useState<number[]>([0, 0]);
  const [loading, setLoading] = useState<boolean>(true);

  const { setTheme, theme } = useTheme();
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;

  const getDimentions = () => {
    const cover = document.querySelector(".cover-display") as HTMLImageElement;
    if (cover != null) {
      setCoverDimention([cover.naturalWidth, cover.naturalHeight]);
    }
  };

  useEffect(() => {
    if (imageSrc != null) {
      setBackground(`url(${imageSrc})`);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      {background != "" || background != null ? (
        <div>
          <div
            id="background"
            className="bg animate__animated animate__fadeIn animate__delay-1s"
            style={{ backgroundImage: background as string }}
          />
          <BackgroundOverlay isDarkMode={true} />
        </div>
      ) : null}
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          padding: coverState ? "0px" : "10px",
          transition: "padding 0.5s ease-in-out",
        }}
      >
        {loading ? (
          <Card
            isBlurred
            style={{
              overflow: "hidden",
              backgroundColor: isDarkMode
                ? "hsla(0,0%,0%,.8)"
                : "hsla(0,0%,100%,.8)",
            }}
          >
            <CardBody>
              <Spinner size="lg" />
            </CardBody>
          </Card>
        ) : (
          <img
            src={imageSrc as string}
            alt="cover"
            className={`cover-display ${coverState ? "display-state" : "info-state"} animate__animated animate__zoomIn`}
          />
        )}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        {loading ? null : (
          <Card
            isBlurred
            style={{
              overflow: "hidden",
              backgroundColor: isDarkMode
                ? "hsla(0,0%,0%,.8)"
                : "hsla(0,0%,100%,.8)",
            }}
            className={`cover-info ${coverState ? "display-state" : "info-state"} animate__animated animate__fadeIn animate__delay-1s`}
          >
            <CardBody>{`${coverDimention[0]} × ${coverDimention[1]}`}</CardBody>
          </Card>
        )}
      </div>
      {loading ? null : (
        <button
          type="button"
          onClick={() => {
            setCoverState(!coverState);
            getDimentions();
          }}
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            height: "100%",
            width: "100%",
            opacity: 0,
            zIndex: 5,
          }}
        >
          toggle info
        </button>
      )}
    </div>
  );
}
