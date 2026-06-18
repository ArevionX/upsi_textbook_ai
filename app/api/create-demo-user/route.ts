import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create the demo user with email adityadesk@gmail.com and password adityadesk@03
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'adityadesk@gmail.com',
      password: 'adityadesk@03',
      email_confirm: true,
      user_metadata: {
        full_name: 'Aditya Desk',
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create profile for the user
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: 'adityadesk@gmail.com',
        full_name: 'Aditya Desk',
        preferred_language: 'en',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Demo user created successfully',
      email: 'adityadesk@gmail.com',
      password: 'adityadesk@03',
    })
  } catch (err) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
