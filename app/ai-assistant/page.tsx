'use client'
import Image from 'next/image'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Send, Loader } from 'lucide-react'
import Link from 'next/link'

export default function AIAssistantPage() {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsSending(true)
    // Add user message to UI
    const userMessage = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const data = await response.json()
      if (data.content) {
        const assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsSending(false)
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 mb-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={32} height={32} className="text-primary object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">AI Study Assistant</h2>
                <p className="text-muted-foreground">Ask me anything about UPSC preparation, concepts, or exam strategies</p>
              </div>
            </div>
          ) : (
            messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask your question or describe your doubt..."
            className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  )
}
