import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-slate-950 min-h-screen antialiased">
      {children}
    </div>
  )
}