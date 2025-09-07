"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function Page() {
  const [date, setDate] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [shareStatus, setShareStatus] = useState<"idle" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) {
      toast({ description: "Please enter a valid date!" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/birthday?date=${date}`)
      const data = await res.json()
      setResult(data)
    } catch (error) {
      toast({ description: "Failed to fetch data. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    if (!result) return

    const shareUrl = window.location.href
    const text = `Check out what happened on my birthday! 🎉\n${result.wikipedia?.events?.[0]?.text || ""}\nNASA Image: ${result.nasa?.title || ""}`
    const shareData = {
      title: "What Happened On My Birthday?",
      text,
      url: shareUrl,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShareStatus("success")
        setTimeout(() => setShareStatus("idle"), 2000)
        return
      }
    } catch (error) {
      console.error("Web Share API failed:", error)
    }

    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`)
      setShareStatus("success")
      setTimeout(() => setShareStatus("idle"), 2000)
    } catch (clipboardError) {
      console.error("Clipboard API failed:", clipboardError)
      setShareStatus("error")
      setTimeout(() => setShareStatus("idle"), 3000)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 md:p-12">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">
        What Happened On My Birthday?
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Find Out"}
        </Button>
      </form>

      {result && (
        <div className="w-full max-w-3xl space-y-6">
          {/* NASA Section */}
          {result.nasa && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">NASA Astronomy Picture</h2>
                {result.nasa.url && (
                  <Image
                    src={result.nasa.url}
                    alt={result.nasa.title}
                    width={800}
                    height={600}
                    className="rounded-lg"
                  />
                )}
                <p className="mt-2 font-medium">{result.nasa.title}</p>
                <p className="text-sm text-muted-foreground">{result.nasa.explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Wikipedia Events Section */}
          {result.wikipedia?.events?.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Historical Events</h2>
                <ul className="list-disc list-inside space-y-1">
                  {result.wikipedia.events.slice(0, 5).map((event: any, idx: number) => (
                    <li key={idx} className="text-sm">
                      <strong>{event.year}:</strong> {event.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Fun Fact Section */}
          {result.funFact && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Fun Fact</h2>
                <p className="text-sm">{result.funFact}</p>
              </CardContent>
            </Card>
          )}

          {/* Share Button */}
          <div className="flex justify-center">
            <Button onClick={handleShare}>
              {shareStatus === "success"
                ? "Copied!"
                : shareStatus === "error"
                ? "Failed!"
                : "Share"}
            </Button>
          </div>
        </div>
      )}

      <footer className="mt-12 text-sm text-muted-foreground text-center">
        🚀 Crafted with passion by <span className="font-semibold">Ashwin Asthana</span>
      </footer>
    </div>
  )
}
