"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Coins } from "lucide-react"

export default function WinningsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Winnings</h1>
        <p className="text-white/60">Track your pending and paid winnings from past draws.</p>
      </div>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-neon-purple" />
            Your Balance
          </CardTitle>
          <CardDescription>Manage and withdraw your winnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/40">
            <p>No winnings yet. Keep submitting your scores!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
