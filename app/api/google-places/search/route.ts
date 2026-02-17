import { NextRequest, NextResponse } from "next/server"

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: "Google Places API key is not configured" }, { status: 500 })
  }

  try {
    // Search for places using Text Search API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + " Gerüstbau Deutschland")}&language=de&key=${GOOGLE_PLACES_API_KEY}`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      return NextResponse.json({ error: searchData.error_message || "Search failed" }, { status: 500 })
    }

    const results = searchData.results?.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      types: place.types,
    })) || []

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Google Places API error:", error)
    return NextResponse.json({ error: "Failed to search places" }, { status: 500 })
  }
}
