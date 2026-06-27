"use client"

import React, { useState } from 'react'

interface Transaction {
  id: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
  created_at: string
}

interface HistoryProps {
  transactionList: Transaction[]
  deleteTransactionAction: (id: string) => void
  updateTransactionAction: (formData: FormData) => Promise<any> // Add action property here
}

export default function TransactionHistory({ 
  transactionList, 
  deleteTransactionAction, 
  updateTransactionAction 
}: HistoryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

  const categories = ['all', 'income', '🍔 Food', '🎮 Gaming', '👟 Clothes', '🚌 Transport', '📦 General']

  const filteredTransactions = transactionList.filter(t => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'income') return t.type === 'income'
    return t.category === activeFilter && t.type === 'expense'
  })

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Activity History ({filteredTransactions.length})
        </h3>
        
        <div className="flex flex-wrap gap-1.5 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all uppercase tracking-wider font-semibold ${
                activeFilter === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-amber-400 hover:border-slate-700'
              }`}
            >
              {cat === 'all' ? '👀 All' : cat === 'income' ? '💰 Income' : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs italic">
          No matching entries found for this filter.
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredTransactions.map((t) => {
            const isEditing = editingId === t.id

            if (isEditing) {
              return (
                <form 
                  key={t.id} 
                  action={async (formData) => {
                    await updateTransactionAction(formData) // Call property action
                    setEditingId(null)
                  }}
                  className="flex flex-col sm:flex-row gap-2 bg-slate-950 p-3 border border-amber-500/40 rounded-xl items-center"
                >
                  <input type="hidden" name="transactionId" value={t.id} />
                  
                  <span className="text-sm bg-slate-900 px-1.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
                    {t.category || '📦'}
                  </span>

                  <input 
                    name="title" 
                    type="text" 
                    defaultValue={t.title}
                    required
                    className="w-full sm:flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />

                  <div className="flex gap-2 w-full sm:w-auto items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">£</span>
                      <input 
                        name="amount" 
                        type="number" 
                        step="0.01"
                        defaultValue={t.amount}
                        required
                        className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-sm focus:outline-none focus:border-amber-500 text-right"
                      />
                    </div>

                    <div className="flex gap-1">
                      <button 
                        type="submit" 
                        className="bg-emerald-500 text-slate-950 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
                      >
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)}
                        className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )
            }

            return (
              <div key={t.id} className="flex justify-between items-center bg-slate-950/50 p-3 border border-slate-800/60 rounded-xl group hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {t.category || '📦'}
                    </span>
                    <p className="font-semibold text-slate-200 text-sm">{t.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm mr-2 ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}£{Number(t.amount).toFixed(2)}
                  </span>
                  
                  <button 
                    onClick={() => setEditingId(t.id)}
                    className="text-slate-600 hover:text-amber-500 text-xs px-2 py-1 rounded-lg bg-slate-900/40 transition-colors opacity-80 group-hover:opacity-100 mr-1"
                    title="Edit transaction"
                  >
                    ✏️
                  </button>

                  <form action={async () => { await deleteTransactionAction(t.id) }}>
                    <button type="submit" className="text-slate-600 hover:text-rose-500 text-xs px-2 py-1 rounded-lg bg-slate-900/40 transition-colors">
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}