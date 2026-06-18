'use client'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, TrendingUp, BarChart3, Calendar } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

  // Sample data for charts
  const performanceData = [
    { date: 'Day 1', accuracy: 75 },
    { date: 'Day 2', accuracy: 78 },
    { date: 'Day 3', accuracy: 82 },
    { date: 'Day 4', accuracy: 80 },
    { date: 'Day 5', accuracy: 85 },
  ]

  const topicData = (stats?.progress || []).map((p: any) => ({
    name: `Topic ${p.topic_id?.substring(0, 8)}`,
    accuracy: p.accuracy_percentage || 0,
  }))

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6']

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Performance Analytics</h1>
          <p className="text-muted-foreground">Track your learning progress and identify areas for improvement</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Overall Accuracy</h3>
              <TrendingUp className="text-primary" size={20} />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats?.stats.overallAccuracy}%</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Questions Done</h3>
              <BarChart3 className="text-primary" size={20} />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats?.stats.totalAttempted}</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Topics Covered</h3>
              <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={20} height={20} className="text-primary object-contain" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats?.stats.topicsStudied}</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Study Days</h3>
              <Calendar className="text-primary" size={20} />
            </div>
            <div className="text-3xl font-bold text-foreground">12</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Accuracy Trend */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Accuracy Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Topic-wise Performance */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Topic-wise Accuracy</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="accuracy" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Progress */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Detailed Topic Progress</h2>
          <div className="space-y-4">
            {(stats?.progress || []).slice(0, 5).map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium text-foreground">Topic {p.topic_id?.substring(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">{p.total_questions_attempted} questions</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{Math.round(p.accuracy_percentage || 0)}%</p>
                  <p className="text-xs text-muted-foreground">{p.correct_answers}/{p.total_questions_attempted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
