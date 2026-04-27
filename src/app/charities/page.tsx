"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Heart, Search, ArrowRight, MapPin, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { SafeImage } from "@/components/ui/safe-image"

const MOCK_CHARITIES = [
  {
    id: "global-edu",
    name: "Global Education Fund",
    category: "Education",
    location: "Worldwide",
    impact: "3.2M Students",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    desc: "Building schools and providing scholarships in developing nations."
  },
  {
    id: "clean-water",
    name: "Clean Water Initiative",
    category: "Environment",
    location: "Sub-Saharan Africa",
    impact: "1.5M Liters daily",
    image: "https://images.unsplash.com/photo-1541888087625-f8148b260959?auto=format&fit=crop&q=80&w=800",
    desc: "Providing sustainable access to clean drinking water."
  },
  {
    id: "youth-golf",
    name: "Youth Golf Foundation",
    category: "Sports & Youth",
    location: "North America",
    impact: "50k Kids trained",
    image: "https://images.unsplash.com/photo-1535136125430-80410712a7f5?auto=format&fit=crop&q=80&w=800",
    desc: "Using golf to teach life skills and provide mentorship to at-risk youth."
  },
  {
    id: "medical-aid",
    name: "Frontline Medical Aid",
    category: "Health",
    location: "Crisis Zones",
    impact: "2M Patients treated",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800",
    desc: "Emergency medical response teams providing critical care."
  },
  {
    id: "save-oceans",
    name: "Save The Oceans",
    category: "Environment",
    location: "Global",
    impact: "10k Tons plastic removed",
    image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&q=80&w=800",
    desc: "Marine conservation and massive ocean cleanup operations."
  },
  {
    id: "hunger-relief",
    name: "Urban Hunger Relief",
    category: "Community",
    location: "Europe & NA",
    impact: "5M Meals served",
    image: "https://images.unsplash.com/photo-1593113592332-ce0f62d85fcd?auto=format&fit=crop&q=80&w=800",
    desc: "Tackling food insecurity in major metropolitan areas."
  }
]

export default function CharitiesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = MOCK_CHARITIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === "All" || c.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-8 pt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Charity Directory</h1>
          <p className="text-white/60 text-lg">Discover and support impactful charities around the globe.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
              placeholder="Search charities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>
          <Select value={category} onValueChange={(val) => setCategory(val || "All")}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 focus:ring-primary">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Environment">Environment</SelectItem>
              <SelectItem value="Sports & Youth">Sports & Youth</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filtered.map((charity) => (
            <motion.div
              key={charity.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-white/10 group hover:border-primary/50 transition-all duration-300 h-full flex flex-col overflow-hidden bg-black/40">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <SafeImage 
                    src={charity.image} 
                    alt={charity.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {charity.category}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-neon-blue transition-colors">{charity.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {charity.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {charity.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-neon-purple font-medium bg-primary/10 w-fit px-3 py-1.5 rounded-lg border border-primary/20">
                    <Target className="w-4 h-4" /> {charity.impact}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/charities/${charity.id}`} className="w-full">
                    <Button variant="outline" className="w-full glass border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:bg-white/10">
                      View Impact <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
              <Heart className="w-16 h-16 mx-auto text-white/20 mb-4" />
              <h3 className="text-xl font-bold">No charities found</h3>
              <p className="text-white/50">Try adjusting your search or category filters.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  )
}
