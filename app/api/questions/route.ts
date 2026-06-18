import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const topicId = searchParams.get('topicId')
    const difficulty = searchParams.get('difficulty')
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'

    let query = supabase.from('questions').select('*', { count: 'exact' })

    if (topicId) {
      query = query.eq('topic_id', topicId)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data: questions, count, error } = await query
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      questions,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
