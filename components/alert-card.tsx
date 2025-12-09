'use client'

import { MapPin, Phone, Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import NoteModal from './note-modal'

interface AlertCardProps {
  alert: any
  onAccept: (id: string) => void
}

export default function AlertCard({ alert, onAccept }: AlertCardProps) {
  const [showNoteModal, setShowNoteModal] = useState(false)
  const alertId = alert._id || alert.id

  return (
    <>
      <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition">
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Alert Info */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF4D6D]/20 text-[#FF6B9D]">
                      {alert.type.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{alert.description.substring(0, 50)}...</h3>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#508CFF]" />
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>

              {alert.photo && (
                <div className="mt-4">
                  <img src={alert.photo || "/placeholder.svg"} alt="alert" className="w-full h-32 object-cover rounded-lg border border-white/10" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={() => onAccept(alertId)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00E0B8] to-[#00B894] text-[#0D0D0D] font-semibold hover:shadow-lg hover:shadow-[#00E0B8]/50 transition"
              >
                Accept Request
              </button>
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNoteModal && (
        <NoteModal alertId={alertId} onClose={() => setShowNoteModal(false)} />
      )}
    </>
  )
}
