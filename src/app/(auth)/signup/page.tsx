"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const full_name = formData.get("full_name") as string
    const charity_id = formData.get("charity_id") as string
    const contribution_percent = parseInt(formData.get("contribution_percent") as string)
    const subscription_plan = formData.get("subscription_plan") as string

    if (contribution_percent < 10) {
      toast.error("Minimum contribution is 10%")
      setLoading(false)
      return
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("mock")) {
      setTimeout(() => {
        toast.success("Mock signup successful! Proceeding to checkout...")
        // In a real app we'd redirect to Stripe checkout here
        router.push("/dashboard")
        setLoading(false)
      }, 1000)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          charity_id,
          contribution_percent,
          subscription_plan,
        }
      }
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Account created successfully! Check your email to verify.")
      router.push("/dashboard")
    }
    setLoading(false)
  }

  return (
    <Card className="glass border-white/10 w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription className="text-white/60">
          Enter your details below to join Golf Charity Rewards
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" required className="bg-black/20 border-white/10 focus:border-primary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-black/20 border-white/10 focus:border-primary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-black/20 border-white/10 focus:border-primary" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="charity_id">Select Charity to Support</Label>
            <Select name="charity_id" required defaultValue="mock-uuid-1">
              <SelectTrigger className="bg-black/20 border-white/10 focus:ring-primary">
                <SelectValue placeholder="Select a charity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mock-uuid-1">Global Education Fund</SelectItem>
                <SelectItem value="mock-uuid-2">Clean Water Initiative</SelectItem>
                <SelectItem value="mock-uuid-3">Youth Golf Foundation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contribution_percent">Contribution %</Label>
              <Input id="contribution_percent" name="contribution_percent" type="number" min="10" max="100" defaultValue="10" required className="bg-black/20 border-white/10 focus:border-primary" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subscription_plan">Subscription Plan</Label>
              <Select name="subscription_plan" required defaultValue="monthly">
                <SelectTrigger className="bg-black/20 border-white/10 focus:ring-primary">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">₹499 / month</SelectItem>
                  <SelectItem value="yearly">₹4999 / year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up & Pay"}
          </Button>
          <div className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
