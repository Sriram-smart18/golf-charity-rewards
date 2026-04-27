import { Trophy, LayoutDashboard, Flag, Gift, Coins, Heart, Settings } from "lucide-react"
import Link from "next/link"
import SignOutButton from "@/components/layout/SignOutButton"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 glass hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-neon-purple" />
            <span className="font-heading font-bold text-white tracking-tight">GCR Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Home
          </Link>
          <Link href="/dashboard/scores" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Flag className="w-5 h-5" /> My Scores
          </Link>
          <Link href="/dashboard/draws" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Gift className="w-5 h-5" /> Monthly Draws
          </Link>
          <Link href="/dashboard/winnings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Coins className="w-5 h-5" /> Winnings
          </Link>
          <Link href="/charities" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Heart className="w-5 h-5" /> Charities
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" /> Profile
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/5 blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/5 blur-[150px]" />
        </div>
        <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
