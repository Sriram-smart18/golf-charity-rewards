"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Heart, ArrowUpRight, Clock, Activity, Target } from "lucide-react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { format, subMonths, parseISO } from "date-fns"

export default function DashboardHome() {
  const [userName, setUserName] = useState("Loading...")
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 30 })
  const [subscriptionStatus, setSubscriptionStatus] = useState("Loading...")
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [winningsCount, setWinningsCount] = useState(0)
  const [charityImpact, setCharityImpact] = useState(0)
  const [charityName, setCharityName] = useState("Charity")
  
  const [scoreData, setScoreData] = useState<{ date: string, score: number }[]>([])
  const [winningData, setWinningData] = useState<{ month: string, amount: number }[]>([
    { month: format(subMonths(new Date(), 4), 'MMM'), amount: 0 },
    { month: format(subMonths(new Date(), 3), 'MMM'), amount: 0 },
    { month: format(subMonths(new Date(), 2), 'MMM'), amount: 0 },
    { month: format(subMonths(new Date(), 1), 'MMM'), amount: 0 },
    { month: format(new Date(), 'MMM'), amount: 0 },
  ])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, charities(name)')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUserName(profile.full_name || user.user_metadata?.first_name || user.email?.split('@')[0] || "Golfer")
        setSubscriptionStatus(profile.subscription_status === 'active' ? 'Active' : 'Inactive')
        // @ts-ignore
        if (profile.charities?.name) {
          // @ts-ignore
          setCharityName(profile.charities.name)
        }
        // Mock impact calculation based on contribution percent
        setCharityImpact(profile.contribution_percent ? profile.contribution_percent * 50 : 500)
      } else {
        setUserName(user.user_metadata?.first_name || user.email?.split('@')[0] || "Golfer")
        setSubscriptionStatus('Inactive')
      }

      // Fetch scores
      const { data: scores } = await supabase
        .from('scores')
        .select('score, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5)

      if (scores && scores.length > 0) {
        const formattedScores = scores.map(s => ({
          date: format(parseISO(s.date), 'MMM d'),
          score: s.score
        })).reverse() // Reverse to show oldest to newest left to right
        setScoreData(formattedScores)
      } else {
        setScoreData([])
      }

      // Fetch winnings
      const { data: winners } = await supabase
        .from('winners')
        .select('prize_amount, created_at')
        .eq('user_id', user.id)

      if (winners && winners.length > 0) {
        const total = winners.reduce((sum, w) => sum + Number(w.prize_amount), 0)
        setTotalWinnings(total)
        setWinningsCount(winners.length)

        // Group winnings by month for the chart
        const chartData = [...winningData]
        winners.forEach(w => {
          const monthStr = format(new Date(w.created_at), 'MMM')
          const existingMonth = chartData.find(d => d.month === monthStr)
          if (existingMonth) {
            existingMonth.amount += Number(w.prize_amount)
          }
        })
        setWinningData(chartData)
      }
    }
    fetchData()

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev
        if (minutes > 0) minutes--
        else {
          minutes = 59
          if (hours > 0) hours--
          else {
            hours = 23
            if (days > 0) days--
          }
        }
        return { days, hours, minutes }
      })
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-white/60">Here's your Golf Charity Rewards overview.</p>
      </div>

      <motion.div 
        initial="hidden" animate="visible" variants={stagger}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeIn}>
          <Card className="glass border-white/10 bg-black/40 hover:bg-black/60 transition-colors group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Subscription</CardTitle>
              <div className={`w-2 h-2 rounded-full ${subscriptionStatus === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold transition-colors ${subscriptionStatus === 'Active' ? 'group-hover:text-green-400' : 'text-red-400'}`}>
                {subscriptionStatus}
              </div>
              <p className="text-xs text-white/40 mt-1">Manage in profile</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="glass border-primary/20 bg-primary/5 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-16 h-16 text-neon-blue" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Next Draw In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-blue">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </div>
              <p className="text-xs text-white/40 mt-1">Prize Pool: ₹149,700</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="glass border-white/10 bg-black/40 hover:bg-black/60 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Total Winnings</CardTitle>
              <ArrowUpRight className="w-4 h-4 text-neon-purple group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-purple">₹{totalWinnings.toLocaleString()}</div>
              <p className="text-xs text-white/40 mt-1">From {winningsCount} draws</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="glass border-white/10 bg-black/40 hover:bg-black/60 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Charity Impact</CardTitle>
              <Heart className="w-4 h-4 text-red-500 group-hover:scale-125 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{charityImpact.toLocaleString()}</div>
              <p className="text-xs text-white/40 mt-1 truncate" title={charityName}>{charityName}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="glass border-white/10 bg-black/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Score Performance
              </CardTitle>
              <CardDescription>Your latest active scores</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              {scoreData.length > 0 ? (
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff50" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#ffffff50" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <p>No scores submitted yet.</p>
                  <Link href="/dashboard/scores" className="mt-4 text-primary hover:underline text-sm">
                    Submit your first score
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="glass border-white/10 bg-black/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-purple" />
                Recent Winnings
              </CardTitle>
              <CardDescription>Your payouts over the last 5 months</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winningData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#ffffff50" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff50" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      cursor={{ fill: '#ffffff10' }}
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                      formatter={(value: any) => [`₹${(value || 0).toLocaleString()}`, 'Payout']}
                    />
                    <Bar dataKey="amount" fill="var(--neon-purple)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card className="glass border-white/10 bg-black/20 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium border border-white/10 text-white/80">
                <Target className="w-4 h-4 text-neon-blue" />
                Pro Tip
              </div>
              <h3 className="text-2xl font-bold">Maximize your odds this month</h3>
              <p className="text-white/60 leading-relaxed max-w-xl">
                The Mega Draw algorithms favor players who consistently submit varied scores. You currently have {scoreData.length} active scores. {scoreData.length === 5 ? "Submitting a new score will bump off your oldest score." : "Submit more scores to increase your chances!"}
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Link href="/dashboard/scores">
                <button className="w-full md:w-auto bg-white text-black hover:bg-white/90 font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95">
                  Submit New Score
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  )
}
