"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Gift, Clock, History, Trophy, CalendarCheck } from "lucide-react"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

export default function DrawsPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 30, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        if (seconds > 0) seconds--
        else {
          seconds = 59
          if (minutes > 0) minutes--
          else {
            minutes = 59
            if (hours > 0) hours--
            else {
              hours = 23
              if (days > 0) days--
            }
          }
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pastDraws = [
    { month: "April 2026", numbers: [7, 14, 22, 35, 42], pool: "₹142,500", matched: 3, prize: "₹250" },
    { month: "March 2026", numbers: [3, 9, 18, 27, 31], pool: "₹138,000", matched: 2, prize: "₹0" },
    { month: "February 2026", numbers: [12, 19, 25, 38, 44], pool: "₹135,200", matched: 4, prize: "₹4,200" },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Monthly Draws</h1>
        <p className="text-white/60">View upcoming draws, past results, and your participation history.</p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-3 gap-6">
        
        {/* Upcoming Draw Card */}
        <motion.div variants={fadeIn} className="md:col-span-2">
          <Card className="glass border-primary/50 relative overflow-hidden bg-primary/5 border-2 h-full">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Gift className="w-48 h-48 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Gift className="w-6 h-6 text-neon-blue" />
                May 2026 Mega Draw
              </CardTitle>
              <CardDescription className="text-lg">Current Estimated Prize Pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue mb-8">
                ₹149,700
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/60 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" /> Live Countdown
                </Label>
                <div className="flex gap-4 text-center">
                  <div className="flex-1 bg-black/40 glass rounded-xl p-4 border border-white/5">
                    <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Days</div>
                  </div>
                  <div className="flex-1 bg-black/40 glass rounded-xl p-4 border border-white/5">
                    <div className="text-3xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Hours</div>
                  </div>
                  <div className="flex-1 bg-black/40 glass rounded-xl p-4 border border-white/5">
                    <div className="text-3xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Mins</div>
                  </div>
                  <div className="flex-1 bg-black/40 glass rounded-xl p-4 border border-white/5">
                    <div className="text-3xl font-bold text-neon-blue">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Secs</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Card */}
        <motion.div variants={fadeIn}>
          <Card className="glass border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-green-400" />
                Participation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm text-white/60 mb-1">Your Eligibility</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Qualified
                </div>
              </div>
              
              <div>
                <div className="text-sm text-white/60 mb-2">Scores Locked In</div>
                <div className="flex flex-wrap gap-2">
                  {[42, 38, 45, 22, 19].map((score, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm">
                      {score}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-xs text-white/40 leading-relaxed">
                  Your 5 most recent scores are automatically entered into the upcoming draw. Keep playing to increase your odds!
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      {/* Past Results */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-neon-purple" />
              Previous Results & History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastDraws.map((draw, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{draw.month}</h3>
                    <div className="text-sm text-white/50">Prize Pool: {draw.pool}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {draw.numbers.map((n, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                        {n}
                      </div>
                    ))}
                  </div>

                  <div className="text-right flex items-center gap-4 md:block">
                    <div className="text-sm text-white/60">
                      Matched: <span className={draw.matched >= 3 ? "text-green-400 font-bold" : "text-white"}>{draw.matched}</span>
                    </div>
                    <div className={`font-bold ${draw.prize !== "₹0" ? "text-neon-blue" : "text-white/40"}`}>
                      Won: {draw.prize}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Custom simple Label component for this page to avoid extra imports if needed, or just standard HTML
function Label({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
