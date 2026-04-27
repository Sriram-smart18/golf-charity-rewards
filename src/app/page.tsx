"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Heart, Coins, ArrowRight, ChevronDown, Quote } from "lucide-react"
import Link from "next/link"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      
      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 glass border-b border-white/5 sticky top-0">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-neon-purple" />
            <span className="font-heading font-bold text-xl text-white tracking-tight">Golf Charity Rewards</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white/70">
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#impact" className="hover:text-white transition-colors">Charity Impact</Link>
            <Link href="#prizes" className="hover:text-white transition-colors">Prizes</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">Join Now</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/30">
                <span className="flex w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                <span className="text-sm font-medium text-white/80">Next Draw: Friday at 8 PM</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8 leading-tight">
                Play Golf. <span className="text-gradient">Win Big.</span> <br /> Give Back.
              </h1>
              <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
                Join the ultimate membership for golfers. Submit your scores, enter monthly draws for luxury prizes, and support charities changing the world.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-8 text-lg font-bold w-full sm:w-auto">
                    Start Your Membership <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg glass border-white/10 hover:bg-white/5 w-full sm:w-auto">
                    View Prizes
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 relative">
          <div className="container mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How It Works</h2>
              <p className="text-white/60 max-w-xl mx-auto">A seamless experience combining your love for golf with philanthropy and huge rewards.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Trophy, title: "1. Track Scores", desc: "Submit your golf scores (1-45). We keep your latest 5 scores on record." },
                { icon: Heart, title: "2. Support Charity", desc: "A portion of your subscription goes directly to a charity of your choice." },
                { icon: Coins, title: "3. Win the Draw", desc: "Monthly draws generate 5 random numbers. Match your scores to win the prize pool!" }
              ].map((step, i) => (
                <motion.div key={i} variants={fadeIn} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <Card className="relative p-8 glass border-white/5 bg-transparent h-full flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                      <step.icon className="w-8 h-8 text-neon-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading">{step.title}</h3>
                    <p className="text-white/60 leading-relaxed">{step.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact & Charity */}
        <section id="impact" className="py-24 px-6 bg-black/50 border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h2 className="text-4xl font-heading font-bold mb-6">Making a Real Impact</h2>
                <p className="text-lg text-white/60 mb-8 leading-relaxed">
                  We believe in the power of the golf community. 20% of all subscription revenue is donated directly to our partner charities. You choose where your contribution goes.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 glass rounded-2xl border-white/5">
                    <div className="text-3xl font-bold text-neon-purple mb-2">₹12.5M+</div>
                    <div className="text-sm text-white/50">Donated so far</div>
                  </div>
                  <div className="p-6 glass rounded-2xl border-white/5">
                    <div className="text-3xl font-bold text-neon-blue mb-2">45+</div>
                    <div className="text-sm text-white/50">Partner Charities</div>
                  </div>
                </div>
              </motion.div>
              <div className="relative h-[400px] rounded-3xl overflow-hidden glass border-white/10 flex items-center justify-center bg-white/5">
                {/* Replace with actual image later */}
                <Heart className="w-32 h-32 text-primary/40 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 relative">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">What Our Members Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Rahul S.", review: "I play golf every weekend anyway. Now I have a chance to win massive prizes while supporting education charities. Absolute no-brainer." },
                { name: "Priya M.", review: "The UI is incredibly slick, and the transparency about the charity donations is exactly what I look for in modern platforms." },
                { name: "Arjun K.", review: "Matched 4 numbers last month and won enough to cover my golf fees for the year! Best subscription I've ever bought." }
              ].map((test, i) => (
                <Card key={i} className="p-8 glass border-white/5 bg-transparent">
                  <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
                  <p className="text-white/80 mb-6 font-sans">"{test.review}"</p>
                  <div className="font-bold font-heading">{test.name}</div>
                  <div className="text-sm text-white/40">Premium Member</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/80 pt-16 pb-8 px-6">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-neon-purple" />
              <span className="font-heading font-bold text-lg text-white tracking-tight">Golf Charity Rewards</span>
            </div>
            <p className="text-white/50 max-w-sm text-sm">
              The premier platform combining golf, charity, and high-stakes monthly rewards.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="#" className="hover:text-white">How it Works</Link></li>
              <li><Link href="#" className="hover:text-white">Charities</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto text-center text-sm text-white/30 pt-8 border-t border-white/5">
          © {new Date().getFullYear()} Golf Charity Rewards. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
