import { NextRequest, NextResponse } from "next/server"

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get("place_id")

  if (!placeId) {
    return NextResponse.json({ error: "place_id parameter is required" }, { status: 400 })
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: "Google Places API key is not configured" }, { status: 500 })
  }

  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,opening_hours,photos,reviews,url,address_components&language=de&key=${GOOGLE_PLACES_API_KEY}`
    
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (detailsData.status !== "OK") {
      return NextResponse.json({ error: detailsData.error_message || "Failed to get place details" }, { status: 500 })
    }

    const place = detailsData.result

    // Extract postal code from address components
    let postalCode = ""
    let city = ""
    let state = ""
    
    if (place.address_components) {
      for (const component of place.address_components) {
        if (component.types.includes("postal_code")) {
          postalCode = component.long_name
        }
        if (component.types.includes("locality")) {
          city = component.long_name
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name
        }
      }
    }

    // Get photo URLs
    const photos = place.photos?.slice(0, 5).map((photo: any) => 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
    ) || []

    const result = {
      place_id: placeId,
      name: place.name,
      address: place.formatted_address,
      postal_code: postalCode,
      city: city,
      state: state,
      phone: place.formatted_phone_number || place.international_phone_number,
      website: place.website,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      opening_hours: place.opening_hours?.weekday_text || [],
      photos: photos,
      google_maps_url: place.url,
      reviews: place.reviews?.slice(0, 5).map((review: any) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
      })) || [],
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Google Places API error:", error)
    return NextResponse.json({ error: "Failed to get place details" }, { status: 500 })
  }
}
