import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate Pokemon ID
    const pokemonId = parseInt(id);
    if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 10000) {
      return new NextResponse("Invalid Pokemon ID", { status: 400 });
    }

    // Construct PokeAPI image URL (official artwork)
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    // Fetch image from PokeAPI
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Pokemon-Pokedex/1.0",
      },
      // Cache for 1 hour
      next: { revalidate: 3600 },
    });

    if (!imageResponse.ok) {
      // Fallback to regular sprite if official artwork not available
      const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Pokemon-Pokedex/1.0",
        },
        next: { revalidate: 3600 },
      });

      if (!fallbackResponse.ok) {
        return new NextResponse("Pokemon image not found", { status: 404 });
      }

      const fallbackImageBuffer = await fallbackResponse.arrayBuffer();

      return new NextResponse(fallbackImageBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600", // 1 day cache
          "CDN-Cache-Control": "public, max-age=86400",
          "Vercel-CDN-Cache-Control": "public, max-age=86400",
        },
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600", // 1 day cache
        "CDN-Cache-Control": "public, max-age=86400",
        "Vercel-CDN-Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
