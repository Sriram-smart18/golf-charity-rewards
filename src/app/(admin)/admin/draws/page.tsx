"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Dices, Play, Save, Settings2 } from "lucide-react"

export default function AdminDrawsPage() {
  const [mode, setMode] = useState("random")
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<{
    numbers: number[],
    prizePool: number,
    rollover: number,
    matches5: { count: number, prizePerWinner: number },
    matches4: { count: number, prizePerWinner: number },
    matches3: { count: number, prizePerWinner: number }
  } | null>(null)

  const simulateDraw = () => {
    setRunning(true)
    
    // Simulate API call and computation
    setTimeout(() => {
      let drawnNumbers: number[] = []
      
      if (mode === "random") {
        while(drawnNumbers.length < 5) {
          const r = Math.floor(Math.random() * 45) + 1
          if (!drawnNumbers.includes(r)) drawnNumbers.push(r)
        }
      } else {
        // Mock weighted: favor numbers 7, 14, 21, 42
        const popular = [7, 14, 21, 42, 33]
        drawnNumbers = popular
      }

      // Calculate mock Prize Pool (e.g. 30% of revenue)
      // Say 1000 subscribers @ 499 = 499,000. 30% = 149,700
      const totalPrizePool = 149700
      
      // Mock user matches
      const m5_count = mode === "weighted" ? 1 : 0 // Someone wins jackpot if weighted
      const m4_count = 12
      const m3_count = 145

      const m5_pool = totalPrizePool * 0.40
      const m4_pool = totalPrizePool * 0.35
      const m3_pool = totalPrizePool * 0.25

      setResults({
        numbers: drawnNumbers.sort((a,b)=>a-b),
        prizePool: totalPrizePool,
        rollover: m5_count === 0 ? m5_pool : 0,
        matches5: { count: m5_count, prizePerWinner: m5_count > 0 ? m5_pool / m5_count : 0 },
        matches4: { count: m4_count, prizePerWinner: m4_count > 0 ? m4_pool / m4_count : 0 },
        matches3: { count: m3_count, prizePerWinner: m3_count > 0 ? m3_pool / m3_count : 0 }
      })

      setRunning(false)
      toast.success("Draw simulation complete!")
    }, 1500)
  }

  const publishDraw = () => {
    toast.success("Draw published! Winners have been notified.")
    setResults(null)
    // Here we would call the actual API to persist the draw and winners to Supabase
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8 pt-20">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Draw Management</h1>
        <p className="text-white/60">Simulate, run, and publish the monthly rewards draw.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass border-white/10 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Draw Configuration
            </CardTitle>
            <CardDescription>Select the algorithm mode for this month's draw.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Algorithm Mode</Label>
              <Select value={mode} onValueChange={(val) => setMode(val || "random")}>
                <SelectTrigger className="bg-black/20 border-white/10 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Pure Random (True RNG)</SelectItem>
                  <SelectItem value="weighted">Algorithmic Weighted (Favors frequent user scores)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Estimated Prize Pool</span>
                <span className="font-bold">₹149,700</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">5 Match (40%)</span>
                <span>₹59,880</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">4 Match (35%)</span>
                <span>₹52,395</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">3 Match (25%)</span>
                <span>₹37,425</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={simulateDraw} 
              disabled={running} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              {running ? "Running Engine..." : <><Play className="w-4 h-4 mr-2" /> Simulate Draw</>}
            </Button>
          </CardFooter>
        </Card>

        {results ? (
          <Card className="glass border-primary/50 relative overflow-hidden bg-primary/5 border-2">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Dices className="w-32 h-32 text-primary" />
            </div>
            <CardHeader>
              <CardTitle>Draw Results</CardTitle>
              <CardDescription>Review results before publishing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white/60 mb-2 block">Drawn Numbers</Label>
                <div className="flex gap-3">
                  {results.numbers.map((n, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-sm text-white/60">Match 5 Winners</div>
                  <div className="text-2xl font-bold text-neon-blue">{results.matches5.count}</div>
                  <div className="text-xs text-white/40 mt-1">₹{results.matches5.prizePerWinner.toLocaleString(undefined, {maximumFractionDigits:0})} each</div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-sm text-white/60">Match 4 Winners</div>
                  <div className="text-2xl font-bold">{results.matches4.count}</div>
                  <div className="text-xs text-white/40 mt-1">₹{results.matches4.prizePerWinner.toLocaleString(undefined, {maximumFractionDigits:0})} each</div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-sm text-white/60">Match 3 Winners</div>
                  <div className="text-2xl font-bold">{results.matches3.count}</div>
                  <div className="text-xs text-white/40 mt-1">₹{results.matches3.prizePerWinner.toLocaleString(undefined, {maximumFractionDigits:0})} each</div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-sm text-white/60">Rollover Amount</div>
                  <div className="text-2xl font-bold text-neon-purple">₹{results.rollover.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                  <div className="text-xs text-white/40 mt-1">Added to next month</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={publishDraw} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Publish Draw & Notify Winners
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-black/20 text-white/40 h-full">
            <div className="text-center">
              <Dices className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Run a simulation to see results.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
