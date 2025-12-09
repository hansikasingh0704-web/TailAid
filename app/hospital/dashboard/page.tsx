'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, Stethoscope } from 'lucide-react'
import AlertCard from '@/components/alert-card'

export default function HospitalDashboard() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem('user')
      if (userData) setUser(JSON.parse(userData))

      try {
        const response = await fetch('/api/alerts?status=pending')
        if (response.ok) {
          const allAlerts = await response.json()
          // Only show alerts that haven't been accepted yet or accepted by hospitals
          const hospitalAlerts = allAlerts.filter((alert: any) => 
            !alert.acceptedByRole || alert.acceptedByRole === 'Hospital / Vet'
          )
          setAlerts(hospitalAlerts)
        }
      } catch (err) {
        console.error('[v0] Error fetching alerts:', err)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  const handleAccept = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'accepted',
          acceptedBy: user?.id,
          acceptedAt: new Date().toLocaleTimeString(),
          acceptedByName: user?.name,
          acceptedByRole: 'Hospital / Vet',
        }),
      })

      if (response.ok) {
        setAlerts(alerts.filter((a) => a._id !== alertId && a.id !== alertId))
      }
    } catch (err) {
      console.error('[v0] Error accepting alert:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-6 h-6 text-[#508CFF]" />
            <h1 className="text-2xl font-bold text-white">Hospital Dashboard</h1>
          </div>
          <p className="text-gray-400 text-sm">Manage veterinary emergency requests</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-[#FF4D6D]" />
            <div>
              <h3 className="font-bold text-white">{alerts.length} Pending Medical Requests</h3>
              <p className="text-gray-400 text-sm">Accept requests to provide veterinary care</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-[#00E0B8] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Urgent Cases</h3>
            <p className="text-gray-400">No pending veterinary emergency requests</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {alerts.map((alert) => (
              <AlertCard key={alert._id || alert.id} alert={alert} onAccept={handleAccept} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
