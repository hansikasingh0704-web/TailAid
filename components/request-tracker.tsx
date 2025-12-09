'use client'

import { MapPin, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RequestTrackerProps {
  userId: string
}

export default function RequestTracker({ userId }: RequestTrackerProps) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching requests for userId:", userId)
        const response = await fetch(`/api/alerts?userId=${encodeURIComponent(userId)}`)
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Fetched requests:", data)
          setRequests(Array.isArray(data) ? data : [])
        } else {
          console.error("[v0] Failed to fetch requests, status:", response.status)
          setRequests([])
        }
      } catch (error) {
        console.error('[v0] Error fetching requests:', error)
        setRequests([])
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchRequests()
      const interval = setInterval(fetchRequests, 5000)
      return () => clearInterval(interval)
    }
  }, [userId])

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const acceptedCount = requests.filter(r => r.status === 'accepted').length

  if (loading && requests.length === 0) {
    return <div className="text-center text-gray-400">Loading your requests...</div>
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-[#FF4D6D]" />
            <p className="text-xs text-gray-400 uppercase">Pending</p>
          </div>
          <p className="text-2xl font-bold text-[#FF4D6D]">{pendingCount}</p>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-[#00E0B8]" />
            <p className="text-xs text-gray-400 uppercase">Accepted</p>
          </div>
          <p className="text-2xl font-bold text-[#00E0B8]">{acceptedCount}</p>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#508CFF]" />
            <p className="text-xs text-gray-400 uppercase">Total</p>
          </div>
          <p className="text-2xl font-bold text-[#508CFF]">{requests.length}</p>
        </div>
      </div>

      {/* Active Requests Timeline */}
      {requests.length > 0 && (
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Real-Time Tracking</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {requests.map((request, index) => (
              <div key={request._id || request.id} className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    request.status === 'accepted' 
                      ? 'bg-[#00E0B8]/20 text-[#00E0B8] border border-[#00E0B8]'
                      : 'bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]'
                  }`}>
                    {index + 1}
                  </div>
                  {index < requests.length - 1 && <div className="w-0.5 h-8 bg-white/10" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{request.type?.toUpperCase() || 'EMERGENCY'} - {(request.description || '').substring(0, 30)}...</p>
                      <p className={`text-xs mt-1 ${request.status === 'accepted' ? 'text-[#00E0B8]' : 'text-[#FF4D6D]'}`}>
                        {request.status === 'accepted' ? '✓ ACCEPTED' : '○ PENDING'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{request.timestamp}</p>
                      {request.acceptedByName && (
                        <p className="text-xs text-[#00E0B8] mt-1">{request.acceptedByName}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No emergency requests yet. Create one to get help!</p>
        </div>
      )}
    </div>
  )
}
