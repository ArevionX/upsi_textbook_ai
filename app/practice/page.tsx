'use client'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Search, Filter, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  topic_id: string
  question_text: string
  difficulty: string
  question_type: string
  options?: any
}

export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(0)
  const router = useRouter()
  const supabase = createClient()
  const itemsPerPage = 10

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      await fetchQuestions()
    }

    checkAuth()
  }, [router, supabase.auth, difficulty, currentPage])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (difficulty !== 'all') params.append('difficulty', difficulty)
      params.append('limit', String(itemsPerPage))
      params.append('offset', String(currentPage * itemsPerPage))

      const response = await fetch(`/api/questions?${params}`)
      const data = await response.json()
      setQuestions(data.questions || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const totalPages = Math.ceil(total / itemsPerPage)

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Practice Questions</h1>
          <p className="text-muted-foreground">Solve questions and track your progress</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground block mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="text-sm font-medium text-foreground block mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value)
                  setCurrentPage(0)
                }}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
              <Filter size={18} />
              More Filters
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={40} height={40} className="text-primary object-contain" />
              </div>
            </div>
          ) : questions.length > 0 ? (
            questions.map((question, idx) => (
              <Link key={question.id} href={`/practice/${question.id}`}>
                <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="text-sm font-semibold text-muted-foreground bg-muted rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {currentPage * itemsPerPage + idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                        {question.question_text}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {question.question_type}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            question.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : question.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition flex-shrink-0" size={24} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">No questions found</p>
              <Button onClick={() => setDifficulty('all')} variant="outline">
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, total)} of {total} questions
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={18} />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
