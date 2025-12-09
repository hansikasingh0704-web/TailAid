'use client'

import { useState, useEffect } from 'react'
import { MapPin, AlertCircle, Plus, CheckCircle, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import EmergencyForm from '@/components/emergency-form'
import StatusCard from '@/components/status-card'
import RequestTracker from '@/components/request-tracker'

export default function UserDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tracking')

  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log("[v0] User loaded:", parsedUser)

        try {
          const userId = parsedUser._id || parsedUser.id || parsedUser.email
          console.log("[v0] Fetching alerts for userId:", userId)
          const response = await fetch(`/api/alerts?userId=${encodeURIComponent(userId)}`)
          if (response.ok) {
            const alerts = await response.json()
            console.log("[v0] Alerts loaded:", alerts)
            setRequests(alerts)
          } else {
            console.error("[v0] Failed to fetch alerts:", response.status)
          }
        } catch (err) {
          console.error('[v0] Error fetching alerts:', err)
        }
      }
      setLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleNewRequest = async (alert: any) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      })

      if (response.ok) {
        const newAlert = await response.json()
        console.log("[v0] Alert created:", newAlert)
        setRequests([...requests, newAlert])
        setShowForm(false)
      }
    } catch (err) {
      console.error('[v0] Error creating alert:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}</h1>
            <p className="text-gray-400 text-sm">Manage your emergency requests</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/user/nearby"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition"
            >
              <Search className="w-5 h-5" />
              Find Help
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF4D6D] to-[#FF6B9D] text-white font-semibold hover:shadow-lg hover:shadow-[#FF4D6D]/50 transition"
            >
              <Plus className="w-5 h-5" />
              New Emergency
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <EmergencyForm onSubmit={handleNewRequest} userId={user?.email || user?.id} />
        </div>
      )}

      {!showForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'tracking'
                  ? 'bg-gradient-to-r from-[#508CFF] to-[#00E0B8] text-white'
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              Real-Time Tracking
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'details'
                  ? 'bg-gradient-to-r from-[#508CFF] to-[#00E0B8] text-white'
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              Request Details
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : activeTab === 'tracking' ? (
          user?.email || user?.id ? <RequestTracker userId={user.email || user.id} /> : null
        ) : requests.length === 0 ? (
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Requests Yet</h3>
            <p className="text-gray-400">Create a new emergency request to get help for injured animals</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <StatusCard key={request._id || request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
