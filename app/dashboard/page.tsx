'use client'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X, Zap, TrendingUp, BookMarked, Brain, Calendar, Settings } from 'lucide-react'

interface DashboardStats {
  profile: any
  stats: {
    totalAttempted: number
    totalCorrect: number
    overallAccuracy: number
    topicsStudied: number
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={24} height={24} className="text-primary-foreground object-contain" />
              </div>
              <span className="text-2xl font-bold text-primary">UPSC AI</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-foreground">Welcome, {stats?.profile?.full_name || 'Student'}</span>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Track your UPSC preparation progress and continue learning</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Accuracy Card */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Overall Accuracy</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="text-primary" size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats?.stats.overallAccuracy}%</div>
            <p className="text-xs text-muted-foreground">{stats?.stats.totalCorrect}/{stats?.stats.totalAttempted} correct</p>
          </div>

          {/* Questions Attempted */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Questions Done</h3>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Zap className="text-orange-600" size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats?.stats.totalAttempted}</div>
            <p className="text-xs text-muted-foreground">Practice questions completed</p>
          </div>

          {/* Topics Studied */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Topics Studied</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <BookMarked className="text-green-600" size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats?.stats.topicsStudied}</div>
            <p className="text-xs text-muted-foreground">UPSC subjects explored</p>
          </div>

          {/* Study Streak */}
          <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Study Streak</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="text-purple-600" size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">0 days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Practice Questions */}
          <Link href="/practice">
            <button className="w-full bg-card rounded-xl border border-border p-8 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Practice Questions</h3>
              <p className="text-sm text-muted-foreground">Start solving questions on your favorite topics</p>
            </button>
          </Link>

          {/* Mock Tests */}
          <Link href="/mock-exams">
            <button className="w-full bg-card rounded-xl border border-border p-8 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                <Calendar className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Mock Exams</h3>
              <p className="text-sm text-muted-foreground">Take full-length practice tests</p>
            </button>
          </Link>

          {/* AI Assistant */}
          <Link href="/ai-assistant">
            <button className="w-full bg-card rounded-xl border border-border p-8 hover:border-primary hover:shadow-lg transition-all group">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                <Brain className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Study Assistant</h3>
              <p className="text-sm text-muted-foreground">Chat with our AI for doubts and explanations</p>
            </button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {!stats?.stats.totalAttempted ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activity yet. Start by solving practice questions!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                You've attempted {stats?.stats.totalAttempted} questions with {stats?.stats.overallAccuracy}% accuracy
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
