"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Coins, CheckCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, parseISO } from "date-fns"

type Winning = {
  id: string
  prize_amount: number
  status: string
  created_at: string
}

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<Winning[]>([])
  const [loading, setLoading] = useState(true)
  const [totalWinnings, setTotalWinnings] = useState(0)

  useEffect(() => {
    const fetchWinnings = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('winners')
        .select('id, prize_amount, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setWinnings(data)
        setTotalWinnings(data.reduce((sum, w) => sum + Number(w.prize_amount), 0))
      }
      setLoading(false)
    }

    fetchWinnings()
  }, [])

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Winnings</h1>
        <p className="text-white/60">Track your pending and paid winnings from past draws.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="glass border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Won</CardTitle>
            <Coins className="w-4 h-4 text-neon-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-purple">₹{totalWinnings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-neon-purple" />
            Your Winnings History
          </CardTitle>
          <CardDescription>Manage and view your payout history.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-white/40">Loading winnings...</div>
          ) : winnings.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p>No winnings yet. Keep submitting your scores!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {winnings.map((w) => (
                <div key={w.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center font-bold text-neon-purple">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Prize Won</div>
                      <div className="text-sm text-white/50">{format(parseISO(w.created_at), 'MMMM d, yyyy')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-white">₹{Number(w.prize_amount).toLocaleString()}</div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {w.status === 'paid' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400 capitalize">{w.status}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400 capitalize">{w.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
