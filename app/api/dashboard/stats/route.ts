import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get user progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    // Get recent quiz sessions
    const { data: sessions } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate overall stats
    const totalAttempted = progress?.reduce((sum, p) => sum + p.total_questions_attempted, 0) || 0
    const totalCorrect = progress?.reduce((sum, p) => sum + p.correct_answers, 0) || 0
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

    return NextResponse.json({
      profile,
      progress,
      sessions,
      stats: {
        totalAttempted,
        totalCorrect,
        overallAccuracy,
        topicsStudied: progress?.length || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
