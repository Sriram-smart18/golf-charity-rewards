"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, CreditCard, Heart, Trophy, ArrowUpRight } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 600, revenue: 4398 },
  { name: 'Mar', users: 1200, revenue: 9800 },
  { name: 'Apr', users: 1800, revenue: 14000 },
  { name: 'May', users: 2400, revenue: 19000 },
  { name: 'Jun', users: 3200, revenue: 25000 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-8 pt-20">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Platform Overview</h1>
        <p className="text-white/60">High-level metrics and analytics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Users</CardTitle>
            <Users className="w-4 h-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,245</div>
            <p className="text-xs text-green-400 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +12% this month</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Active Subs</CardTitle>
            <CreditCard className="w-4 h-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,850</div>
            <p className="text-xs text-green-400 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +8% this month</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Charity Contributions</CardTitle>
            <Heart className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹845,000</div>
            <p className="text-xs text-green-400 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +15% this month</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Current Prize Pool</CardTitle>
            <Trophy className="w-4 h-4 text-neon-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-purple">₹149,700</div>
            <p className="text-xs text-white/40 mt-1">For upcoming draw</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass border-white/10 p-2">
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
            <CardDescription>Monthly active users</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-blue)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--neon-blue)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" />
                  <YAxis stroke="#ffffff50" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="var(--neon-blue)" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 p-2">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly recurring revenue (₹)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--neon-purple)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" />
                  <YAxis stroke="#ffffff50" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--neon-purple)" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
