'use client'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, ChevronLeft, CheckCircle, AlertCircle, BookmarkPlus } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  question_text: string
  question_type: string
  difficulty: string
  options?: string[]
  correct_answer: string
  explanation: string
  tags?: string[]
}

export default function QuestionDetailPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const router = useRouter()
  const params = useParams()
  const questionId = params.id as string
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

      await fetchQuestion()
    }

    checkAuth()
  }, [router, supabase.auth, questionId])

  const fetchQuestion = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('questions').select('*').eq('id', questionId).single()

      if (error) {
        console.error('Error fetching question:', error)
        return
      }

      setQuestion(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSubmitAnswer = () => {
    if (question && selectedAnswer) {
      const correct = selectedAnswer === question.correct_answer
      setIsCorrect(correct)
      setSubmitted(true)
    }
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

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/practice" className="flex items-center gap-2 hover:opacity-80 transition">
                <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={24} height={24} className="text-primary object-contain" />
                <span className="text-xl font-bold text-primary">Back</span>
              </Link>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Question not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/practice" className="flex items-center gap-2 hover:opacity-80 transition group">
              <ChevronLeft className="text-primary group-hover:translate-x-[-2px] transition" size={24} />
              <span className="text-lg font-semibold text-primary">Back to Practice</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <BookmarkPlus size={18} />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Card */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          {/* Tags and Difficulty */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{question.question_type.toUpperCase()}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                question.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700'
                  : question.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {question.difficulty.toUpperCase()}
            </span>
          </div>

          {/* Question Text */}
          <h1 className="text-2xl font-bold text-foreground mb-8">{question.question_text}</h1>

          {/* Answer Options or Input */}
          {question.question_type === 'mcq' && question.options ? (
            <div className="space-y-3 mb-8">
              {question.options.map((option: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => !submitted && setSelectedAnswer(option)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary/5'
                      : submitted && option === question.correct_answer
                        ? 'border-green-500 bg-green-50'
                        : submitted && option === selectedAnswer && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option ? 'border-primary bg-primary' : 'border-border'
                      }`}
                    >
                      {selectedAnswer === option && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium text-foreground">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={selectedAnswer}
              onChange={(e) => !submitted && setSelectedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-8 disabled:opacity-50"
              disabled={submitted}
            />
          )}

          {/* Submit Button or Result */}
          {!submitted ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="mb-8">
              <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="text-green-600" size={24} />
                    <div>
                      <p className="font-semibold text-green-900">Correct!</p>
                      <p className="text-sm text-green-700">Great job! You got this right.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-red-600" size={24} />
                    <div>
                      <p className="font-semibold text-red-900">Incorrect</p>
                      <p className="text-sm text-red-700">The correct answer is: {question.correct_answer}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Explanation */}
              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">Explanation</h3>
                <p className="text-foreground leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {submitted && (
            <div className="flex gap-4 mt-8 pt-8 border-t border-border">
              <Button variant="outline" className="flex-1">
                Previous Question
              </Button>
              <Link href="/practice" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Next Question</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
