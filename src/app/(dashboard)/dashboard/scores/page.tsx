"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Trash2, Plus, Flag } from "lucide-react"
import { format } from "date-fns"

type Score = {
  id: string
  score: number
  date: string
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([
    { id: "1", score: 42, date: "2026-05-20" },
    { id: "2", score: 38, date: "2026-05-18" },
    { id: "3", score: 45, date: "2026-05-15" },
    { id: "4", score: 22, date: "2026-05-10" },
  ])

  const [newScore, setNewScore] = useState("")
  const [newDate, setNewDate] = useState("")

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault()
    
    const scoreVal = parseInt(newScore)
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      toast.error("Score must be between 1 and 45")
      return
    }

    if (!newDate) {
      toast.error("Please select a date")
      return
    }

    // Check unique date
    if (scores.some(s => s.date === newDate)) {
      toast.error("A score for this date already exists. Edit or delete it first.")
      return
    }

    const newScoreObj: Score = {
      id: Math.random().toString(36).substr(2, 9),
      score: scoreVal,
      date: newDate
    }

    // Sort by date descending
    let updatedScores = [...scores, newScoreObj].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Rolling logic: retain only latest 5
    if (updatedScores.length > 5) {
      updatedScores = updatedScores.slice(0, 5) // since it's sorted desc, slice(0,5) keeps the 5 most recent dates
      toast.info("Rolling logic applied: The oldest score was removed.")
    }

    setScores(updatedScores)
    setNewScore("")
    setNewDate("")
    toast.success("Score added successfully!")
    
    // TODO: Connect to Supabase
    // const { error } = await supabase.from('scores').insert({ user_id: user.id, score: scoreVal, date: newDate })
    // if success, trigger a postgres function or edge function to delete oldest if count > 5
  }

  const handleDelete = (id: string) => {
    setScores(scores.filter(s => s.id !== id))
    toast.success("Score deleted")
    // TODO: Connect to Supabase
    // await supabase.from('scores').delete().eq('id', id)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">My Scores</h1>
        <p className="text-white/60">Manage your golf scores. Only your latest 5 scores are kept for the monthly draw.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Add Score</CardTitle>
              <CardDescription>Submit a new golf score.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddScore} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Score (1-45)</Label>
                  <Input 
                    id="score" 
                    type="number" 
                    min="1" 
                    max="45" 
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    className="bg-black/20 border-white/10 focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-black/20 border-white/10 focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Score
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="glass border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Scores ({scores.length}/5)</CardTitle>
                <CardDescription>These scores will be used in the next draw.</CardDescription>
              </div>
              <Flag className="text-neon-blue w-6 h-6 opacity-50" />
            </CardHeader>
            <CardContent>
              {scores.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Flag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No scores submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scores.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                          {s.score}
                        </div>
                        <div>
                          <div className="font-medium text-white">Score Submitted</div>
                          <div className="text-sm text-white/50">{format(new Date(s.date), 'MMMM d, yyyy')}</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(s.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
