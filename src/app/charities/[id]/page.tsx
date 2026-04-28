"use client"

import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft, Users, Globe2, BookOpen, Calendar, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from "framer-motion"

const data = [
  { name: 'Jan', donations: 12000 },
  { name: 'Feb', donations: 19000 },
  { name: 'Mar', donations: 15000 },
  { name: 'Apr', donations: 28000 },
  { name: 'May', donations: 34000 },
  { name: 'Jun', donations: 42000 },
]

export default function CharityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // Example dummy data mapper based on ID or fallback
  const isGlobalEdu = id === "global-edu" || id === "1"

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-8 pt-20">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/charities" className="inline-flex items-center text-sm text-white/60 hover:text-white mb-6 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Link>
      </motion.div>

      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden h-80 md:h-96 glass border-white/10">
        <img 
          src={isGlobalEdu ? "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&q=80&w=1200" : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"} 
          alt="Charity cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-neon-blue font-bold mb-2 text-sm tracking-widest uppercase">
              <Globe2 className="w-4 h-4" /> Global Impact
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
              {isGlobalEdu ? "Global Education Fund" : "Humanitarian Relief Partners"}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Providing critical resources and sustainable infrastructure to communities in need across the globe.
            </p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-[0_0_20px_rgba(var(--primary),0.5)]">
            <Heart className="w-5 h-5 mr-2" /> Support This Charity
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card className="glass border-white/10 bg-black/40">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-neon-purple mb-4" />
                <div className="text-3xl font-bold text-white">3.2M</div>
                <div className="text-sm text-white/50 mt-1">People Reached</div>
              </CardContent>
            </Card>
            <Card className="glass border-white/10 bg-black/40">
              <CardContent className="p-6">
                <BookOpen className="w-8 h-8 text-neon-blue mb-4" />
                <div className="text-3xl font-bold text-white">142</div>
                <div className="text-sm text-white/50 mt-1">Active Projects</div>
              </CardContent>
            </Card>
            <Card className="glass border-white/10 bg-black/40 col-span-2 sm:col-span-1">
              <CardContent className="p-6">
                <Globe2 className="w-8 h-8 text-green-400 mb-4" />
                <div className="text-3xl font-bold text-white">24</div>
                <div className="text-sm text-white/50 mt-1">Countries</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Donation Growth via GCR</CardTitle>
              <CardDescription>Monthly contributions from Golf Charity Rewards platform</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--neon-purple)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`₹${(value || 0).toLocaleString()}`, 'Contributions']}
                    />
                    <Area type="monotone" dataKey="donations" stroke="var(--neon-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 leading-relaxed mb-6 text-lg">
                We believe that access to fundamental resources is a basic human right. By partnering with local communities, we build sustainable infrastructure that lasts generations. 
                With the help of the Golf Charity Rewards platform, we've increased our impact by 40% year over year, funding dozens of new initiatives directly from user subscriptions.
              </p>
              <Button variant="outline" className="glass border-white/20 hover:bg-white/10">
                Read Full Report <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="glass border-white/10 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Annual Gala Fundraiser", date: "June 15, 2026", loc: "New York, NY" },
                { title: "Golf Charity Pro-Am", date: "July 22, 2026", loc: "Pebble Beach, CA" },
                { title: "Global Summit", date: "September 5, 2026", loc: "London, UK" },
              ].map((event, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                  <h4 className="font-bold text-white group-hover:text-primary transition-colors">{event.title}</h4>
                  <div className="flex flex-col gap-1 mt-2 text-sm text-white/50">
                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {event.date}</span>
                    <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {event.loc}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p><strong>Email:</strong> contact@globaledufund.org</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong><br/>123 Impact Way, Suite 400<br/>San Francisco, CA 94105</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
