import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check if demo user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'demo@upscai.com')
      .single()

    if (existingUser) {
      return Response.json({ message: 'Demo user already exists' }, { status: 200 })
    }

    // Create auth user (if not exists)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo@upscai.com',
      password: 'Demo@123456',
      email_confirm: true,
      user_metadata: {
        first_name: 'Demo',
        last_name: 'User',
      },
    })

    if (authError && !authError.message.includes('already exists')) {
      return Response.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData?.user?.id || existingUser?.id

    if (!userId) {
      return Response.json({ error: 'Failed to get user ID' }, { status: 400 })
    }

    // Create profile
    await supabase.from('profiles').upsert({
      id: userId,
      email: 'demo@upscai.com',
      full_name: 'Demo User',
      study_goal: 'Civil Services Examination',
      target_year: 2025,
      preferred_language: 'en',
    })

    return Response.json({ message: 'Demo user created successfully', userId }, { status: 201 })
  } catch (error) {
    console.error('Setup error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
