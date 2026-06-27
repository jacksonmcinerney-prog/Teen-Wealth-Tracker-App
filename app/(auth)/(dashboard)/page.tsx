import React from 'react'
import { createServerSideClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { addTransaction } from '../../dashboard/actions'

export default async function DashboardPage() {
  const supabase = await createServerSideClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/signup')
  }

  // Fetch the transactions from Supabase
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  // Calculate your actual live ledger balance from database entries
  const transactionList = transactions || []
  const totalIncome = transactionList
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalSpent = transactionList
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const currentBalance = totalIncome - totalSpent

  return (
    <div className="min-h-screen bg-slate-950 text-amber-400 p-6 md:p-12">
      <header className="max-w-6xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight">
            Teen Wealth Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">Logged in as: {user.email}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Balance Card Overview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Available Balance
            </h3>
            <p className="text-5xl font-black text-amber-500 tracking-tight">
              £{currentBalance.toFixed(2)}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/50 flex gap-4 text-xs">
            <div><span className="text-slate-500">In:</span> <span className="text-emerald-400 font-medium">£{totalIncome.toFixed(2)}</span></div>
            <div><span className="text-slate-500">Out:</span> <span className="text-rose-400 font-medium">£{totalSpent.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Add Transaction Form Block */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Log Transaction
          </h3>
          <form action={async (formData) => { "use server"; await addTransaction(formData); }} className="space-y-3 text-sm text-slate-200">
            <div>
              <input 
                name="title" 
                type="text" 
                placeholder="Description (e.g., Allowance, Snacks)" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-2">
              <input 
                name="amount" 
                type="number" 
                step="0.01" 
                placeholder="Amount (£)" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
              <select 
                name="type"
                className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-amber-500 focus:outline-none focus:border-amber-500"
              >
                <option value="income">Income (+)</option>
                <option value="expense">Expense (-)</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Save Entry
            </button>
          </form>
        </div>

        {/* Dynamic Ledger List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Recent Activity History
          </h3>
          {transactionList.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500">
              No transactions posted yet. Use the entry block to log your money flows!
            </div>
          ) : (
            <div className="space-y-2">
              {transactionList.map((t) => (
                <div key={t.id} className="flex justify-between items-center bg-slate-950/50 p-3 border border-slate-800/60 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-200">{t.title}</p>
                    <p className="text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}£{Number(t.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}