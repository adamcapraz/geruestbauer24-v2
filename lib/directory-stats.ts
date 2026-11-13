import "server-only"
import { createClient } from "@supabase/supabase-js"

const PAGE_SIZE = 1000

type RatingRow = {
  google_bewertung: number | null
  google_anzahl_bewertungen: number | null
  bewertung: number | null
  anzahl_bewertungen: number | null
}

export async function getDirectoryStats() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server credentials are required to calculate directory statistics.")
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const [companiesResult, requestsResult] = await Promise.all([
    supabase.from("firmen").select("id", { count: "exact", head: true }).eq("aktiv", true),
    supabase.from("anfragen").select("id", { count: "exact", head: true }),
  ])

  if (companiesResult.error) throw companiesResult.error
  if (requestsResult.error) throw requestsResult.error

  const companyCount = companiesResult.count ?? 0
  let weightedRatingTotal = 0
  let reviewCount = 0

  for (let offset = 0; offset < companyCount; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("firmen")
      .select("google_bewertung, google_anzahl_bewertungen, bewertung, anzahl_bewertungen")
      .eq("aktiv", true)
      .order("id")
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) throw error

    for (const row of (data ?? []) as RatingRow[]) {
      const rating = row.google_bewertung ?? row.bewertung
      const count = row.google_anzahl_bewertungen ?? row.anzahl_bewertungen ?? 0
      if (rating !== null && count > 0) {
        weightedRatingTotal += Number(rating) * count
        reviewCount += count
      }
    }
  }

  return {
    companyCount,
    requestCount: requestsResult.count ?? 0,
    averageRating: reviewCount > 0 ? weightedRatingTotal / reviewCount : null,
  }
}
