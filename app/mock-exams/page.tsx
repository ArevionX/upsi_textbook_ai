'use client'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Plus, Clock, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function MockExamsPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin">
          <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={40} height={40} className="text-primary object-contain" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="bg-primary p-2 rounded-lg">
                <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={24} height={24} className="text-primary-foreground object-contain" />
              </div>
              <span className="text-2xl font-bold text-primary">UPSC AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mock Exams</h1>
          <p className="text-muted-foreground">Practice with full-length exams designed to simulate the actual UPSC pattern</p>
        </div>

        {/* Create New Mock */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Start a New Mock Exam</h2>
              <p className="opacity-90">Test your knowledge with a full practice test</p>
            </div>
            <Button size="lg" className="bg-white hover:bg-slate-50 text-primary font-semibold flex items-center gap-2">
              <Plus size={20} />
              Start Mock Exam
            </Button>
          </div>
        </div>

        {/* Mock Tests List */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Mock */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-foreground mb-4">Full Length UPSC Mock Test</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-primary" size={20} />
                <span className="text-sm text-foreground">Duration: 6 hours (Prelims + Mains)</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary" size={20} />
                <span className="text-sm text-foreground">250 questions across all sections</span>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start Exam</Button>
          </div>

          {/* Prelims Mock */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-foreground mb-4">UPSC Prelims Mock Test</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-primary" size={20} />
                <span className="text-sm text-foreground">Duration: 2 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary" size={20} />
                <span className="text-sm text-foreground">100 MCQ questions</span>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start Exam</Button>
          </div>

          {/* Mains Mock */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-foreground mb-4">UPSC Mains Mock Test</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-primary" size={20} />
                <span className="text-sm text-foreground">Duration: 3 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary" size={20} />
                <span className="text-sm text-foreground">Descriptive questions</span>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start Exam</Button>
          </div>

          {/* Topic Wise Mock */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-foreground mb-4">Topic-wise Mock Tests</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-primary" size={20} />
                <span className="text-sm text-foreground">Duration: 30-60 minutes each</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary" size={20} />
                <span className="text-sm text-foreground">Practice specific topics</span>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Choose Topic</Button>
          </div>
        </div>

        {/* Recent Mock Tests */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Mock Tests</h2>
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven&apos;t taken any mock tests yet</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Take Your First Mock Test</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
