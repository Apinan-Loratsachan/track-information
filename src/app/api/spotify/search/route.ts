import { NextResponse } from "next/server";

const searchSpotifyAlbumData = async (search: string) => {
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

  // Search for album data by ID
  const albumResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${search}&type=album&limit=1&offset=0`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!albumResponse.ok) {
    throw new Error(`Error fetching album data: ${albumResponse.statusText}`);
  }

  return albumResponse.json();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(
      { error: "Missing search parameter" },
      { status: 400 }
    );
  }

  try {
    const albumData = await searchSpotifyAlbumData(search);
    return NextResponse.json(albumData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
