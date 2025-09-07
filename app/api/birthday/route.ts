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
    const [eventsData, nasaData] = await Promise.allSettled([fetchWikipediaEvents(month, day), fetchNASAImage(date)])

    const birthdayData: BirthdayData = {
      date,
      events: eventsData.status === "fulfilled" ? eventsData.value : [],
      nasaImage: nasaData.status === "fulfilled" ? nasaData.value : null,
      numberFact: "", // Empty string since fun facts are removed
    }

    return NextResponse.json(birthdayData)
  } catch (error) {
    console.error("Error fetching birthday data:", error)
    return NextResponse.json({ error: "Failed to fetch birthday data" }, { status: 500 })
  }
}

async function fetchWikipediaEvents(month: string, day: string): Promise<WikipediaEvent[]> {
  try {
    const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`, {
      headers: {
        "User-Agent": "BirthdayApp/1.0 (https://birthday-app.vercel.app)",
      },
    })

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`)
    }

    const data = await response.json()

    // Combine events, births, and deaths, then sort by year and take top 15
    const allEvents = [
      ...(data.events || []).map((event: any) => ({ ...event, type: "event" })),
      ...(data.births || []).map((birth: any) => ({ ...birth, type: "birth" })),
      ...(data.deaths || []).map((death: any) => ({ ...death, type: "death" })),
    ]

    return allEvents
      .sort((a, b) => b.year - a.year) // Sort by year descending
      .slice(0, 15) // Take top 15 most recent
  } catch (error) {
    console.error("Error fetching Wikipedia events:", error)
    return []
  }
}

async function fetchNASAImage(date: string): Promise<NASAImage | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${date}&api_key=h9YHocSNzojTxSnjNwf35b797P6e7HgTGgbjHIEK`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "BirthdayApp/1.0 (https://birthday-app.vercel.app)",
        },
      },
    )

    clearTimeout(timeoutId)

    if (response.status === 429) {
      console.log("NASA API rate limited, using fallback")
      return {
        title: "Astronomy Picture of the Day",
        explanation:
          "Due to high demand, we're currently unable to fetch the specific astronomy picture for this date. The NASA Astronomy Picture of the Day showcases stunning images of our universe, from distant galaxies to planetary phenomena.",
        url: "/space-astronomy-stars-galaxy.jpg",
        date: date,
        media_type: "image",
      }
    }

    if (!response.ok) {
      console.log(`NASA API error: ${response.status}, trying fallback`)
      const fallbackResponse = await fetch(
        "https://api.nasa.gov/planetary/apod?api_key=h9YHocSNzojTxSnjNwf35b797P6e7HgTGgbjHIEK",
        {
          signal: controller.signal,
        },
      )

      if (fallbackResponse.ok && fallbackResponse.status !== 429) {
        return await fallbackResponse.json()
      }

      return {
        title: "Astronomy Picture of the Day",
        explanation:
          "Explore the wonders of our universe through NASA's daily astronomy images, featuring breathtaking views of space phenomena, distant galaxies, and cosmic events.",
        url: "/nasa-space-astronomy-nebula.jpg",
        date: date,
        media_type: "image",
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching NASA image:", error)
    return {
      title: "Astronomy Picture of the Day",
      explanation:
        "The cosmos awaits your exploration. NASA's Astronomy Picture of the Day brings you daily images and discoveries from the universe around us.",
      url: "/space-cosmos-stars-universe.jpg",
      date: date,
      media_type: "image",
    }
  }
}
