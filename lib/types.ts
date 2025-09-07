export interface WikipediaEvent {
  text: string
  pages: Array<{
    title: string
    extract: string
    thumbnail?: {
      source: string
    }
  }>
  year: number
  type?: "event" | "birth" | "death"
}

export interface NASAImage {
  date: string
  explanation: string
  hdurl?: string
  media_type: string
  service_version: string
  title: string
  url: string
  copyright?: string
}

export interface BirthdayData {
  date: string
  events: WikipediaEvent[]
  nasaImage: NASAImage | null
  numberFact: string
}
