import { type NextRequest, NextResponse } from "next/server"
import type { WikipediaEvent, NASAImage, BirthdayData } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  try {
    const dateObj = new Date(date)
    const month = String(dateObj.getMonth() + 1).padStart(2, "0")
    const day = String(dateObj.getDate()).padStart(2, "0")

    // Fetch all data in parallel
    const [eventsData, nasaData] = await Promise.allSettled([
      fetchWikipediaEvents(month, day),
      fetchNASAImage(date),
    ])

    const birthdayData: BirthdayData = {
      date,
      events: eventsData.status === "fulfilled" ? eventsData.value : [],
      nasaImage: nasaData.status === "fulfilled" ? nasaData.value : null,
      numberFact: "", // fun facts removed
    }

    return NextResponse.json(birthdayData)
  } catch (error) {
    console.error("Error fetching birthday data:", error)
    return NextResponse.json({ error: "Failed to fetch birthday data" }, { status: 500 })
  }
}

// Wikipedia
async function fetchWikipediaEvents(month: string, day: string): Promise<WikipediaEvent[]> {
  try {
    const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`, {
      headers: { "User-Agent": "BirthdayApp/1.0 (https://birthday-app.vercel.app)" },
    })

    if (!response.ok) throw new Error(`Wikipedia API error: ${response.status}`)

    const data = await response.json()

    // Combine events, births, deaths
    const allEvents = [
      ...(data.events || []).map((event: any) => ({ ...event, type: "event" })),
      ...(data.births || []).map((birth: any) => ({ ...birth, type: "birth" })),
      ...(data.deaths || []).map((death: any) => ({ ...death, type: "death" })),
    ]

    return allEvents.sort((a, b) => b.year - a.year).slice(0, 15) // Top 15 most recent
  } catch (error) {
    console.error("Error fetching Wikipedia events:", error)
    return []
  }
}

// NASA APOD
async function fetchNASAImage(date: string): Promise<NASAImage | null> {
  try {
    const apiKey = process.env.NASA_API_KEY
    if (!apiKey) throw new Error("NASA API key is missing!")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`,
      { signal: controller.signal, headers: { "User-Agent": "BirthdayApp/1.0 (https://birthday-app.vercel.app)" } },
    )

    clearTimeout(timeoutId)

    if (response.status === 429) {
      console.log("NASA API rate limited, using fallback")
      return {
        title: "Astronomy Picture of the Day",
        explanation:
          "Due to high demand, we're currently unable to fetch the specific astronomy picture for this date. Stunning images of our universe await!",
        url: "/space-astronomy-stars-galaxy.jpg",
        date,
        media_type: "image",
      }
    }

    if (!response.ok) {
      console.log(`NASA API error: ${response.status}, using fallback`)
      return {
        title: "Astronomy Picture of the Day",
        explanation:
          "Explore the wonders of our universe through NASA's daily astronomy images.",
        url: "/nasa-space-astronomy-nebula.jpg",
        date,
        media_type: "image",
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching NASA image:", error)
    return {
      title: "Astronomy Picture of the Day",
      explanation:
        "The cosmos awaits your exploration. NASA's Astronomy Picture of the Day brings you daily images from the universe.",
      url: "/space-cosmos-stars-universe.jpg",
      date,
      media_type: "image",
    }
  }
}
