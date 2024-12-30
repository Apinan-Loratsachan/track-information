import { NextResponse } from "next/server";

const getSpotifyTrackData = async (spotifyTrackId: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  // Get access token
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64Credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) {
    throw new Error(`Error fetching token: ${tokenResponse.statusText}`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Search for track data by ID
  const trackResponse = await fetch(
    `https://api.spotify.com/v1/tracks/${spotifyTrackId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!trackResponse.ok) {
    throw new Error(`Error fetching track data: ${trackResponse.statusText}`);
  }

  return trackResponse.json();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spotifyTrackId = searchParams.get("spotifyTrackId");

  if (!spotifyTrackId) {
    return NextResponse.json(
      { error: "Missing or invalid track ID" },
      { status: 400 }
    );
  }

  try {
    const trackData = await getSpotifyTrackData(spotifyTrackId);
    return NextResponse.json(trackData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
