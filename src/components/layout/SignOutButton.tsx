"use client"

import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    // If mock, just redirect
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("mock")) {
      toast.success("Signed out successfully")
      router.push("/login")
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Signed out successfully")
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <button 
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left mt-2"
    >
      <LogOut className="w-5 h-5" /> Sign Out
    </button>
  )
}
