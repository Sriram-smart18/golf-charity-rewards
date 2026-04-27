import { Trophy } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center items-center p-6">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-purple/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-blue/10 blur-[150px]" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <Trophy className="w-10 h-10 text-primary" />
          </Link>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Golf Charity Rewards</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
