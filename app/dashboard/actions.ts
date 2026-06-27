'use server'

// Ensure this matches the relative path to your lib folder
import { createServerSideClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation' // <-- ADD THIS IMPORT LINE HERE


export async function addTransaction(formData: FormData) {
  const title = formData.get('title') as string
  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const category = formData.get('category') as string

  if (!title || isNaN(amount) || !type || !category) {
    return { error: 'All fields are required.' }
  }

  const supabase = await createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'User session not found.' }

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        title,
        amount,
        type,
        category,
        user_id: user.id
      }
    ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
} // <- Make sure there is only ONE closing brace here before the next function starts!



export async function addGoal(formData: FormData) {
  const title = formData.get('title') as string
  const targetStr = formData.get('target_amount') as string

  if (!title || !targetStr) {
    return { error: 'Please fill in all goal fields.' }
  }

  const target_amount = parseFloat(targetStr)
  if (isNaN(target_amount) || target_amount <= 0) {
    return { error: 'Please enter a valid target amount.' }
  }

  const supabase = await createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'User session not found.' }

  const { error } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      title,
      target_amount,
      current_amount: 0.00
    })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
}


export async function deleteTransaction(id: string) {
  if (!id) return { error: 'Transaction ID required.' }

  const supabase = await createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'User session not found.' }

  const { error } = await supabase
  .from('transactions')
  .delete()
  .eq('id', id)
  // .eq('user_id', user.id) // <- Comment this line out with two slashes temporarily
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
}





export async function deleteGoal(formData: FormData) {
  "use server"
  
  const goalId = formData.get('goalId') as string
  if (!goalId) {
    console.error("No goalId provided in form data")
    return
  }

  const supabase = await createServerSideClient()

  // Match the string UUID directly
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)

  if (error) {
    console.error("Supabase Deletion Error: ", error.message)
    return { error: error.message }
  }

  redirect('/dashboard')
}


export async function updateTransaction(formData: FormData) {
  "use server"

  const transactionId = formData.get('transactionId') as string
  const title = formData.get('title') as string
  const amountStr = formData.get('amount') as string

  if (!transactionId || !title || !amountStr) {
    console.error("Missing required fields for update")
    return
  }

  const supabase = await createServerSideClient()

  // Execute the update
  const { error } = await supabase
    .from('transactions')
    .update({
      title: title,
      amount: Number(amountStr) // Ensure it passes as a strict number type
    })
    .eq('id', transactionId)

  if (error) {
    console.error("Supabase Update Error details:", error.message)
    return { error: error.message }
  }

  // Refresh the data on the screen
  revalidatePath('/dashboard', 'page')
}