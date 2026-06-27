'use server'

import { createServerSideClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

export async function authenticateUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const actionType = formData.get('actionType') as string

  if (!email || !password) {
    return { error: 'Please fill in all fields.' }
  }

  const supabase = await createServerSideClient()

  if (actionType === 'signup') {
    // Explicitly pass an empty options object to block automatic path generation loops
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {}
    })

    if (error) return { error: error.message }
    
    redirect('/dashboard')
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { error: error.message }

    redirect('/dashboard')
  }
}