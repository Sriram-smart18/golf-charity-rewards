"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { User, Mail, Shield, Calendar, Settings, Heart, Percent } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    email: string;
    joinDate: string;
    status: string;
    charityId: string | null;
    contributionPercent: number | null;
  }>({
    fullName: "Loading...",
    email: "loading@example.com",
    joinDate: "Loading...",
    status: "Loading...",
    charityId: null,
    contributionPercent: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          router.push("/login")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        const fullName = profileData?.full_name || 
                         user.user_metadata?.full_name || 
                         [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ") ||
                         user.email?.split('@')[0] ||
                         "Golfer"

        setUserProfile({
          fullName: fullName,
          email: user.email || profileData?.email || "",
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          status: profileData?.subscription_status || "Active",
          charityId: profileData?.charity_id || null,
          contributionPercent: profileData?.contribution_percent || null
        })
      } catch (err) {
        console.error("Failed to load profile:", err)
        setUserProfile({
          fullName: "Demo User",
          email: "demo@example.com",
          joinDate: "January 2024",
          status: "Demo Mode",
          charityId: "demo-charity-id",
          contributionPercent: 10
        })
      }
    }
    fetchUser()
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Your Profile</h1>
        <p className="text-white/60">Manage your account settings and personal information.</p>
      </div>

      <motion.div 
        initial="hidden" animate="visible" variants={fadeIn}
        className="max-w-3xl"
      >
        <Card className="glass border-white/10 bg-black/40">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center">
                <User className="w-10 h-10 text-neon-purple" />
              </div>
              <div>
                <CardTitle className="text-2xl">{userProfile.fullName}</CardTitle>
                <CardDescription className="text-white/60 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {userProfile.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-white/90">
                  {userProfile.fullName}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-white/90">
                  {userProfile.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Member Since
                </label>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-white/90">
                  {userProfile.joinDate}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Account Status
                </label>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-green-400 font-medium flex items-center gap-2 capitalize">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> {userProfile.status}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Selected Charity
                </label>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-white/90 truncate">
                  {userProfile.charityId || "Not selected"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Contribution Percentage
                </label>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-white/90">
                  {userProfile.contributionPercent ? `${userProfile.contributionPercent}%` : "0%"}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-neon-blue" />
                Preferences
              </h3>
              <p className="text-white/60 text-sm mb-4">
                To update your password or notification settings, please contact support.
              </p>
              <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium px-4 py-2 rounded-lg transition-colors">
                Contact Support
              </button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
