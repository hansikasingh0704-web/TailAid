'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'

interface NoteModalProps {
  alertId: string
  onClose: () => void
}

export default function NoteModal({ alertId, onClose }: NoteModalProps) {
  const [note, setNote] = useState('')
  const [eta, setEta] = useState('')
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      console.log("[v0] Submitting note for alertId:", alertId)
      
      const noteResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alertId,
          text: note,
          eta,
          instructions,
          createdAt: new Date(),
        }),
      })

      if (!noteResponse.ok) {
        console.error('[v0] Failed to create note')
        throw new Error('Failed to create note')
      }

      console.log("[v0] Note created successfully")

      // Also update the alert with custom note details
      const updateResponse = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customNote: note,
          eta,
          instructions,
        }),
      })

      if (updateResponse.ok) {
        console.log("[v0] Alert updated successfully")
        onClose()
      }
    } catch (err) {
      console.error('[v0] Error updating note:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Custom Note</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300" disabled={loading}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Rescue Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#508CFF] focus:bg-white/10 transition resize-none"
              rows={3}
              placeholder="Message to the user..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Estimated Arrival Time</label>
            <input
              type="text"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#508CFF] focus:bg-white/10 transition"
              placeholder="e.g., 15 minutes"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Additional Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#508CFF] focus:bg-white/10 transition resize-none"
              rows={2}
              placeholder="e.g., Keep the animal in a safe place..."
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#508CFF] to-[#00E0B8] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#508CFF]/50 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Sending...' : 'Send Note'}
          </button>
        </div>
      </div>
    </div>
  )
}
