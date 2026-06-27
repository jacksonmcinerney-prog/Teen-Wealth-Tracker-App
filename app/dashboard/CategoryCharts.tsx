"use client"

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ChartProps {
  transactionList: any[]
}

const EXPENSE_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#6366f1']
const INCOME_COLORS = ['#10b981', '#3b82f6', '#84cc16', '#a855f7']

export default function CategoryCharts({ transactionList }: ChartProps) {
  // 1. Process Expenses Data
  const expenseMap = transactionList
    .filter(t => t.type === 'expense')
    .reduce((acc: { [key: string]: number }, t) => {
      const cat = t.category || '📦 General'
      acc[cat] = (acc[cat] || 0) + Number(t.amount)
      return acc
    }, {})

  const expenseData = Object.entries(expenseMap).map(([name, value]) => ({ name, value }))

  // 2. Process Income Data
  const incomeMap = transactionList
    .filter(t => t.type === 'income')
    .reduce((acc: { [key: string]: number }, t) => {
      const cat = t.category || '💰 Allowance/Job'
      acc[cat] = (acc[cat] || 0) + Number(t.amount)
      return acc
    }, {})

  const incomeData = Object.entries(incomeMap).map(([name, value]) => ({ name, value }))

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
      
      {/* Expenses Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center overflow-hidden">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 self-start">
          📉 Where Your Money Goes (Expenses)
        </h4>
        {expenseData.length === 0 ? (
          <p className="text-xs text-slate-500 italic my-12">No expenses logged yet.</p>
        ) : (
          <div className="w-full h-[320px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <Pie
  data={expenseData}
  cx="50%"
  cy="45%"
  innerRadius={45}
  outerRadius={65}
  paddingAngle={4}
  dataKey="value"
  labelLine={false}
  label={({ name, value, percent }) => {
    const shortName = name ? name.split(' ')[0] : 'Other';
    const displayPercent = percent ? (percent * 100).toFixed(0) : '0';
return `${shortName} £${value.toFixed(0)} (${displayPercent}%)`
  }}
>
  {expenseData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
  ))}
</Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#f59e0b' }}
                  formatter={(value: any) => [`£${Number(value || 0).toFixed(2)}`, 'Amount']}
                  />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', bottom: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Income Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center overflow-hidden">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 self-start">
          📈 Where Your Money Comes From (Income)
        </h4>
        {incomeData.length === 0 ? (
          <p className="text-xs text-slate-500 italic my-12">No income logged yet.</p>
        ) : (
          <div className="w-full h-[320px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <Pie
  data={incomeData}
  cx="50%"
  cy="45%"
  innerRadius={45}
  outerRadius={65}
  paddingAngle={4}
  dataKey="value"
  labelLine={false}
  label={({ name, value, percent }) => {
    const shortName = name ? name.split(' ')[0] : 'Other';
    const displayPercent = percent ? (percent * 100).toFixed(0) : '0';
return `${shortName} £${value.toFixed(0)} (${displayPercent}%)`
  }}
>
  {incomeData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
  ))}
</Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#10b981' }}
                  formatter={(value: any) => [`£${Number(value || 0).toFixed(2)}`, 'Amount']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', bottom: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  )
}