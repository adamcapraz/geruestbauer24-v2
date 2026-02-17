import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  
  const stadtSlug = searchParams.get("stadt_slug")
  const search = searchParams.get("search")
  const bundesland = searchParams.get("bundesland")
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50
  
  let query = supabase
    .from("firmen")
    .select("*")
    .eq("aktiv", true)
    .order("google_bewertung", { ascending: false, nullsFirst: false })
    .limit(limit)
  
  if (stadtSlug) {
    query = query.eq("stadt_slug", stadtSlug)
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,stadt.ilike.%${search}%`)
  }
  
  if (bundesland) {
    query = query.eq("bundesland", bundesland)
  }
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ firmen: data })
}
