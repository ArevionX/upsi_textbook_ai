'use client'
import Image from 'next/image'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, Shield, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-md flex-shrink-0">
                <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={36} height={36} className="object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-white tracking-wide">UPSC AI</span>
                <span className="text-[11px] text-white/50 font-medium tracking-widest uppercase">Elite Preparation</span>
              </div>
            </div>
            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-[#1a1a1a] to-[#b38b6d] border border-white/10 hover:border-white/20 hover:from-[#222] hover:to-[#c49a7a] text-white font-semibold rounded-lg px-6 py-2 shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-6">
            <span className="glass px-4 py-2 text-sm font-medium text-primary">
              🚀 Now in Early Access
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Ace Your UPSC <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">with AI Intelligence</span>
          </h1>
          <p className="text-xl text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto">
            AI-powered learning, topic-wise practice questions, mock exams, and personalized guidance — built specifically for serious UPSC aspirants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-[#1a1a1a] to-[#b38b6d] border border-white/10 hover:border-white/20 hover:from-[#222] hover:to-[#c49a7a] text-white font-bold text-lg h-14 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
                Start Learning Today
                <ArrowRight className="ml-3" size={24} />
              </Button>
            </Link>
          </div>
        </div>

        {/* What you get */}
        <div className="grid md:grid-cols-3 gap-8 my-24">
          {[
            { icon: Brain, label: 'AI Study Assistant', desc: 'Ask anything, get clear UPSC-focused answers instantly' },
            { icon: Zap, label: 'Mock Exams', desc: 'Full-length tests that mirror the real UPSC pattern' },
            { icon: TrendingUp, label: 'Progress Tracking', desc: 'See exactly where you stand and what to improve' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <item.icon className="text-teal-400" size={26} />
              </div>
              <div className="text-lg font-bold text-white mb-1">{item.label}</div>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-white/70">A focused toolkit built for UPSC preparation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: 'AI Study Assistant', desc: 'Get clear, exam-relevant explanations on any UPSC topic instantly' },
            { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Track your performance and identify weak areas with precision' },
            { icon: Zap, title: 'Mock Exams', desc: 'Attempt full-length tests designed on the actual UPSC pattern' },
            { icon: Shield, title: 'Topic-wise Q-Bank', desc: 'Curated practice questions across GS, CSAT, and optional subjects' },
            { icon: CheckCircle, title: 'Personalised Plans', desc: 'Study schedules tailored to your target date and current level' },
            { icon: Users, title: 'Built for Aspirants', desc: 'Every feature is designed with the UPSC journey in mind' },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 group hover:shadow-2xl hover:shadow-teal-500/10 transition-all">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-teal-400" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-4">Ready to Begin Your UPSC Journey?</h2>
            <p className="text-xl text-white/70 mb-10">Get early access and start preparing smarter, not harder.</p>
            <Link href="/auth/login">
              <Button size="lg" className="bg-gradient-to-r from-[#1a1a1a] to-[#b38b6d] border border-white/10 hover:border-white/20 hover:from-[#222] hover:to-[#c49a7a] text-white font-bold text-lg h-14 px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all">
                Get Early Access
                <ArrowRight className="ml-3" size={24} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/60 backdrop-blur-md mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Image src="/assets/UPSC_Logo.png" alt="UPSC AI Logo" width={28} height={28} className="object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-white tracking-wide">UPSC AI</span>
                <span className="text-[10px] text-white/40 font-medium tracking-widest uppercase">Elite Preparation</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-white/40">
              <span>© 2026 UPSC AI. All rights reserved.</span>
              <span className="hidden sm:inline">·</span>
              <span>
                Developed by{' '}
                <a
                  href="https://www.arevionx.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  ArevionX
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
