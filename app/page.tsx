"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ImageIcon, Share2, Github, Linkedin, Check, Copy, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BirthdayData } from "@/lib/types"

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [birthdayData, setBirthdayData] = useState<BirthdayData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "success" | "error">("idle")
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")

  const validateDate = (dateString: string): { isValid: boolean; message: string } => {
    const selectedDateObj = new Date(dateString)
    const today = new Date()
    const nasaStartDate = new Date("1995-06-16")

    if (isNaN(selectedDateObj.getTime())) {
      return { isValid: false, message: "Please enter a valid date." }
    }

    if (selectedDateObj > today) {
      return { isValid: false, message: "Please select a date from the past. We can't predict the future!" }
    }

    if (selectedDateObj < nasaStartDate) {
      return {
        isValid: false,
        message:
          "NASA's Astronomy Picture of the Day archive starts from June 16, 1995. Please select a date from June 16, 1995 onwards.",
      }
    }

    return { isValid: true, message: "" }
  }

  const handleDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return

    const validation = validateDate(selectedDate)
    if (!validation.isValid) {
      setValidationMessage(validation.message)
      setShowValidationModal(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/birthday?date=${selectedDate}`)

      if (!response.ok) {
        throw new Error("Failed to fetch birthday data")
      }

      const data: BirthdayData = await response.json()
      setBirthdayData(data)
    } catch (error) {
      console.error("Error fetching birthday data:", error)
      setError("Failed to load birthday data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setBirthdayData(null)
    setSelectedDate("")
    setError(null)
  }

  const handleShare = async () => {
    if (!birthdayData) return

    setShareStatus("sharing")

    const shareUrl = `${window.location.origin}?date=${birthdayData.date}`
    const text = `Check out what happened on ${new Date(birthdayData.date).toLocaleDateString()}! 🌟`

    const shareData = {
      title: "My Birthday Story",
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
      console.log("[v0] Web Share API failed:", error)
    }

    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`)
      setShareStatus("success")
      setTimeout(() => setShareStatus("idle"), 2000)
    } catch (clipboardError) {
      console.log("[v0] Clipboard API failed:", clipboardError)
      setShareStatus("error")
      setTimeout(() => setShareStatus("idle"), 3000)
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {showValidationModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowValidationModal(false)}
          >
            <motion.div
              className="bg-background/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none" />

              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground font-display">Invalid Date</h3>
                  </div>
                  <button
                    onClick={() => setShowValidationModal(false)}
                    className="w-8 h-8 rounded-full bg-background/20 border border-white/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/30 hover:border-white/30 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6 font-sans">{validationMessage}</p>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowValidationModal(false)}
                    className="bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary font-medium border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:border-white/20 font-display"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {!birthdayData ? (
            <motion.div
              key="landing"
              className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 sm:space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto px-4">
                <motion.h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight tracking-tight font-display"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="overflow-hidden mb-2" variants={textVariants} custom={0}>
                    {"Discover Your".split("").map((letter, i) => (
                      <motion.span key={i} variants={letterVariants} custom={i} className="inline-block">
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </motion.div>
                  <motion.div className="font-medium overflow-hidden" variants={textVariants} custom={1}>
                    {"Birthday Story".split("").map((letter, i) => (
                      <motion.span key={i} variants={letterVariants} custom={i + 12} className="inline-block">
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.h2>

                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 font-sans"
                  variants={textVariants}
                  custom={2}
                  initial="hidden"
                  animate="visible"
                >
                  Discover NASA's stunning astronomy picture of the day from any date in history.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="w-full max-w-md mx-auto px-4"
              >
                <Card className="bg-background/20 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:border-white/30 hover:bg-background/30 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none group-hover:border-white/20 transition-colors duration-500" />

                  <CardHeader className="text-center pb-4 relative z-10">
                    <CardTitle className="text-lg font-medium text-foreground font-display">Select Your Date</CardTitle>
                    <CardDescription className="text-muted-foreground font-sans">
                      Choose any date to explore its history
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <form onSubmit={handleDateSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthday" className="text-sm text-foreground font-sans">
                          Date
                        </Label>
                        <Input
                          id="birthday"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-background/30 backdrop-blur-sm border-white/20 focus:border-white/40 focus:ring-white/20 text-foreground transition-all duration-300 hover:bg-background/40 hover:border-white/30 font-sans"
                          required
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/20 p-3 rounded backdrop-blur-sm font-sans"
                        >
                          {error}
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary font-medium py-3 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:border-white/20 font-display"
                        disabled={loading || !selectedDate}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Explore Date</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="space-y-8 sm:space-y-12 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div></div>
                <Button
                  onClick={resetSearch}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-foreground bg-background/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(255,255,255,0.1)] hover:border-white/30 font-display"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Search Another Date
                </Button>
              </div>

              <motion.div
                className="text-center space-y-4 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground font-display">
                  {new Date(birthdayData.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg font-sans">Your birthday story</p>
              </motion.div>

              {birthdayData.nasaImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="px-4"
                >
                  <Card className="overflow-hidden bg-background/10 backdrop-blur-xl border border-white/20 shadow-2xl relative group transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] hover:bg-background/20 hover:border-white/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500" />

                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-lg sm:text-xl text-foreground font-display">
                        <ImageIcon className="w-5 h-5" />
                        NASA Astronomy Picture
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-sans">
                        {birthdayData.nasaImage.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      <div className="relative overflow-hidden rounded border border-white/20 group-hover:border-white/30 transition-colors duration-500">
                        <img
                          src={birthdayData.nasaImage.url || "/placeholder.svg"}
                          alt={birthdayData.nasaImage.title}
                          className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground text-base sm:text-lg font-display">
                          {birthdayData.nasaImage.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base font-sans">
                          {birthdayData.nasaImage.explanation}
                        </p>
                        {birthdayData.nasaImage.copyright && (
                          <p className="text-muted-foreground/60 text-xs sm:text-sm font-mono">
                            © {birthdayData.nasaImage.copyright}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center px-4"
              >
                <Card className="bg-background/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-md mx-auto relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-background/20 hover:border-white/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500" />

                  <CardContent className="p-6 space-y-4 relative z-10">
                    <p className="text-muted-foreground font-sans">Share your birthday story</p>

                    <Button
                      className="bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary font-medium border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:border-white/20 font-display"
                      onClick={handleShare}
                      disabled={shareStatus === "sharing"}
                    >
                      {shareStatus === "sharing" && (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          Sharing...
                        </>
                      )}
                      {shareStatus === "success" && (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied to clipboard!
                        </>
                      )}
                      {shareStatus === "error" && (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Try again
                        </>
                      )}
                      {shareStatus === "idle" && (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </>
                      )}
                    </Button>

                    {shareStatus === "error" && (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-destructive text-sm font-sans"
                      >
                        Unable to share. Please copy the URL manually.
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 bg-background/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-foreground font-medium text-base sm:text-lg font-display">Made by Ashwin Asthana</p>
              <p className="text-muted-foreground text-xs sm:text-sm font-sans">Discover your birthday story</p>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a
                href="https://github.com/ashwinasthana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(255,255,255,0.1)] p-2 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-background/30"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/ashwinasthanax"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(255,255,255,0.1)] p-2 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-background/30"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}
