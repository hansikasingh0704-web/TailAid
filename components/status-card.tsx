'use client'

import { CheckCircle, Clock, AlertCircle, User, MessageSquare, Clock3 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StatusCardProps {
  request: any
}

export default function StatusCard({ request }: StatusCardProps) {
  const [notes, setNotes] = useState<any[]>([])
  const [notesLoading, setNotesLoading] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setNotesLoading(true)
        const requestId = request._id || request.id
        console.log("[v0] Fetching notes for alertId:", requestId, "Request:", request)
        
        if (!requestId) {
          console.warn("[v0] No requestId available")
          setNotes([])
          return
        }

        const response = await fetch(`/api/notes?alertId=${encodeURIComponent(String(requestId))}`)
        if (response.ok) {
          const notesData = await response.json()
          console.log("[v0] Notes fetched:", notesData)
          setNotes(Array.isArray(notesData) ? notesData : [])
        } else {
          console.error("[v0] Failed to fetch notes, status:", response.status)
          setNotes([])
        }
      } catch (error) {
        console.error('[v0] Error fetching notes:', error)
        setNotes([])
      } finally {
        setNotesLoading(false)
      }
    }

    if (request.status === 'accepted') {
      fetchNotes()
      const interval = setInterval(fetchNotes, 3000)
      return () => clearInterval(interval)
    }
  }, [request.status, request._id, request.id])

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl overflow-hidden">
      {request.status === 'pending' && (
        <div className="bg-gradient-to-r from-[#FF4D6D]/20 to-transparent p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-[#FF4D6D]" />
            <div>
              <h3 className="font-bold text-white">Request Pending</h3>
              <p className="text-gray-400 text-sm">Waiting for rescue center or hospital to respond</p>
            </div>
          </div>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="bg-gradient-to-r from-[#00E0B8]/20 to-transparent p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-[#00E0B8]" />
            <div>
              <h3 className="font-bold text-white text-lg">Help is On The Way!</h3>
              <p className="text-gray-400 text-sm">Your request has been accepted</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Responding Organization</p>
              <p className="text-white font-semibold">{request.acceptedByName}</p>
              <p className="text-gray-400 text-sm">{request.acceptedByRole}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Accepted At</p>
              <p className="text-white font-semibold">{request.acceptedAt}</p>
            </div>
          </div>

          {request.customNote && (
            <div className="mt-4 bg-white/5 rounded-lg p-4 border border-[#508CFF]/30">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-[#508CFF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Custom Note</p>
                  <p className="text-white">{request.customNote}</p>
                  {request.eta && (
                    <div className="mt-2 flex items-center gap-2 text-[#00E0B8] text-sm">
                      <Clock3 className="w-4 h-4" />
                      ETA: {request.eta}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!notesLoading && notes.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-white">Latest Updates:</p>
              {notes.map((note) => (
                <div key={note._id || note.id} className="bg-white/5 rounded-lg p-4 border border-[#00E0B8]/20">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-[#00E0B8] mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                      <p className="text-white text-sm">{note.text}</p>
                      {note.eta && (
                        <p className="text-xs text-[#00E0B8] mt-2">ETA: {note.eta}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Request Details */}
      <div className="p-6">
        <h3 className="font-bold text-white mb-4">Request Details</h3>
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Type</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FF4D6D]/20 text-[#FF6B9D]">
              {request.type.toUpperCase()}
            </span>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
            <p className="text-gray-300">{request.description}</p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reported At</p>
            <p className="text-gray-300">{request.timestamp}</p>
          </div>

          {request.photo && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Animal Photo</p>
              <img src={request.photo || "/placeholder.svg"} alt="animal" className="w-full rounded-lg max-h-64 object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
