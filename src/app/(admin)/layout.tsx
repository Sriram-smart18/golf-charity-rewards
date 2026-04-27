import { Trophy, LayoutDashboard, Dices, Users, Heart, Coins } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/80 glass hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-primary/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-neon-purple" />
            <span className="font-heading font-bold text-white tracking-tight">Admin Portal</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Analytics
          </Link>
          <Link href="/admin/draws" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-primary/20 hover:text-primary transition-colors">
            <Dices className="w-5 h-5" /> Draw Engine
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Users className="w-5 h-5" /> Users
          </Link>
          <Link href="/admin/charities" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Heart className="w-5 h-5" /> Charities
          </Link>
          <Link href="/admin/winners" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Coins className="w-5 h-5" /> Payouts & Proof
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-[url('/noise.png')] bg-repeat">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/10 blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/10 blur-[150px]" />
        </div>
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
