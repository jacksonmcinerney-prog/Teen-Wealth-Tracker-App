import React from 'react'
import { createServerSideClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { addTransaction, addGoal, deleteTransaction, deleteGoal, updateTransaction } from './actions'
import SandboxCalculator from './SandboxCalculator'
import CategoryCharts from './CategoryCharts'
import TransactionHistory from './TransactionHistory'


export default async function DashboardPage() {
  const supabase = await createServerSideClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/signup')
  }

  // Fetch data
  const [transactionsResponse, goalsResponse] = await Promise.all([
    supabase.from('transactions').select('*').order('created_at', { ascending: false }),
    supabase.from('goals').select('*').order('created_at', { ascending: false })
  ])

  const transactionList = transactionsResponse.data || []
  const goalList = goalsResponse.data || []

  // Core Ledger Math
  const totalIncome = transactionList
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const totalSpent = transactionList
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const currentBalance = totalIncome - totalSpent

  const activeGoal = goalList[0]

  // Goals Velocity Engine calculations
  const netSavings = totalIncome - totalSpent
  const amountRemaining = activeGoal ? Math.max(activeGoal.target_amount - currentBalance, 0) : 0
  const weeklySavingRate = netSavings > 0 ? netSavings / 4 : 0
  const weeksRemaining = weeklySavingRate > 0 ? amountRemaining / weeklySavingRate : null

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

        {/* Savings Goal Status */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          {activeGoal ? (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-start w-full">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Active Savings Goal
                  </h3>
                  <p className="text-xl font-bold text-slate-200">{activeGoal.title}</p>
                </div>
                
                {/* Clear Goal Action Button */}
                <form action={async (formData) => { await deleteGoal(formData); }}>
                  <input type="hidden" name="goalId" value={activeGoal.id} />
                  <button 
                    type="submit" 
                    className="text-xs text-slate-500 hover:text-amber-500 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 transition-colors"
                  >
                    ✕ Reset
                  </button>
                </form>
              </div>
              
              <div>
                {(() => {
                  const progressAmount = currentBalance > 0 ? Math.min(currentBalance, activeGoal.target_amount) : 0
                  const percentage = activeGoal.target_amount > 0 ? (progressAmount / activeGoal.target_amount) * 100 : 0
                  
                  let barColor = "bg-amber-500"
                  let milestoneBadge = "🌱 Just Starting"
                  
                  if (percentage >= 100) {
                    barColor = "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    milestoneBadge = "🏆 Goal Smashed!"
                  } else if (percentage >= 75) {
                    barColor = "bg-teal-400"
                    milestoneBadge = "⚡ Almost There! (75%+)"
                  } else if (percentage >= 50) {
                    barColor = "bg-cyan-400"
                    milestoneBadge = "🚀 Halfway! (50%+)"
                  } else if (percentage >= 25) {
                    barColor = "bg-amber-400"
                    milestoneBadge = "🏎️ Building Momentum (25%+)"
                  }

                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-medium mb-1 items-center">
                        <span className="text-slate-300 font-semibold text-[10px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                          {milestoneBadge}
                        </span>
                        <span className="text-amber-500 font-mono">£{progressAmount.toFixed(2)} / £{Number(activeGoal.target_amount).toFixed(2)}</span>
                      </div>
                      
                      <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
                        <div 
                          className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      {weeksRemaining !== null ? (
                        <p className="text-[11px] text-slate-400 mt-2">
                          ⏱️ At your current velocity, you will hit this goal in approximately <span className="text-amber-400 font-bold">{Math.ceil(weeksRemaining)} weeks</span>!
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-2">
                          Add more income entries to generate a completion timeline projection.
                        </p>
                      )}

                      <p className="text-[11px] text-slate-500 mt-1">
                        {currentBalance >= activeGoal.target_amount 
                          ? "🎉 Target reached! Great job saving up." 
                          : `You need £${Math.max(activeGoal.target_amount - currentBalance, 0).toFixed(2)} more to reach this target.`}
                      </p>
                    </div>
                  )
                })()}
              </div>
            </div>
          ) : (
            <div className="w-full">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Set a Savings Goal
              </h3>
              <form action={async (formData) => { await addGoal(formData); }} className="space-y-3 text-sm text-slate-200">
                <input 
                  name="title" 
                  type="text" 
                  placeholder="What are you saving for?" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <input 
                  name="target_amount" 
                  type="number" 
                  step="0.01" 
                  placeholder="Target Amount (£)" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button 
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Create Target
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar Controls Layout */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Log Transaction
            </h3>
            <form action={async (formData) => { await addTransaction(formData); }} className="space-y-3 text-sm text-slate-200">
              <div>
                <input 
                  name="title" 
                  type="text" 
                  placeholder="Description (e.g., Snacks)" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <select 
                  name="category"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-500 focus:outline-none focus:border-amber-500"
                >
                  <option value="🍔 Food">🍔 Food</option>
                  <option value="🎮 Gaming">🎮 Gaming</option>
                  <option value="👟 Clothes">👟 Clothes</option>
                  <option value="🚌 Transport">🚌 Transport</option>
                  <option value="💰 Allowance/Job">💰 Allowance/Job</option>
                  <option value="📦 General">📦 General</option>
                </select>
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

          <SandboxCalculator currentBalance={currentBalance} activeGoal={activeGoal} />
        </div>

        {/* Main Content Layout Block */}
<div className="md:col-span-2 space-y-6">
  <CategoryCharts transactionList={transactionList} />

  {/* New Interactive Filtering Component */}
  <TransactionHistory 
    transactionList={transactionList} 
    deleteTransactionAction={deleteTransaction} 
    updateTransactionAction={updateTransaction}
  />
</div>

      </main>
    </div>
  )
}