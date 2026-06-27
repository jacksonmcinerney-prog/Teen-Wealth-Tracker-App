"use client"

import React from 'react'

interface SandboxProps {
  currentBalance: number
  activeGoal: { title: string; target_amount: number } | null
}

export default function SandboxCalculator({ currentBalance, activeGoal }: SandboxProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        🧐 "Can I Afford It?" Sandbox
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Test a wish-list purchase to see how it impacts your active savings goal timeline.
      </p>
      
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Item Cost (£)</label>
          <input 
            id="sandbox-cost"
            type="number" 
            placeholder="Enter item price... (e.g., 80)" 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            onChange={(e) => {
              const cost = parseFloat(e.target.value) || 0
              const newBalance = currentBalance - cost
              const statusEl = document.getElementById('sandbox-status')
              
              if (statusEl) {
                if (cost <= 0) {
                  statusEl.innerHTML = "Enter a price above to run the numbers!"
                  statusEl.className = "text-xs text-slate-500 italic"
                } else if (newBalance < 0) {
                  statusEl.innerHTML = `⚠️ Buying this puts you into negative balance (£${newBalance.toFixed(2)}). Avoid this purchase right now!`
                  statusEl.className = "text-xs text-rose-400 font-medium bg-rose-950/20 p-2 rounded-lg border border-rose-900/40"
                } else if (activeGoal && newBalance < activeGoal.target_amount) {
                  const extendedAmount = activeGoal.target_amount - newBalance
                  statusEl.innerHTML = `📉 You can buy it, but it lowers your balance to £${newBalance.toFixed(2)}, making you £${extendedAmount.toFixed(2)} short of your goal.`
                  statusEl.className = "text-xs text-amber-500/90 font-medium bg-amber-950/20 p-2 rounded-lg border border-amber-900/30"
                } else {
                  statusEl.innerHTML = `✅ Clear for purchase! You will still have £${newBalance.toFixed(2)} remaining, keeping your savings target safe.`
                  statusEl.className = "text-xs text-emerald-400 font-medium bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/40"
                }
              }
            }}
          />
        </div>

        <div className="pt-2 border-t border-slate-800/60">
          <p id="sandbox-status" className="text-xs text-slate-500 italic">
            Enter a price above to run the numbers!
          </p>
        </div>
      </div>
    </div>
  )
}