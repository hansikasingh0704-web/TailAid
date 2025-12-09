'use client'

import { useState } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'

interface EmergencyFormProps {
  userId: string
  onSubmit: (alert: any) => void
}

export default function EmergencyForm({ userId, onSubmit }: EmergencyFormProps) {
  const [description, setDescription] = useState('')
  const [alertType, setAlertType] = useState('injury')
  const [photo, setPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description) {
      alert('Please describe the situation')
      return
    }

    setLoading(true)

    const alertData = {
      userId,
      type: alertType,
      description,
      photo,
      status: 'pending',
    }

    onSubmit(alertData)
    setLoading(false)
    setDescription('')
    setAlertType('injury')
    setPhoto(null)
  }

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Report Emergency</h2>

      {/* Alert Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-3">Emergency Type</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'injury', label: 'Injury' },
            { value: 'medical', label: 'Medical' },
            { value: 'mistreatment', label: 'Mistreatment' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setAlertType(type.value)}
              className={`py-3 rounded-lg font-semibold transition ${
                alertType === type.value
                  ? 'bg-gradient-to-r from-[#FF4D6D] to-[#FF6B9D] text-white'
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-3">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#508CFF] focus:bg-white/10 transition resize-none"
          rows={4}
          placeholder="Describe the situation (location, animal condition, etc.)"
          disabled={loading}
        />
      </div>

      {/* Photo Upload */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-3">Photo (Optional)</label>
        {photo ? (
          <div className="relative">
            <img src={photo || "/placeholder.svg"} alt="preview" className="w-full rounded-lg max-h-48 object-cover border border-[#00E0B8]/30" />
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="absolute top-2 right-2 p-2 bg-[#FF4D6D] rounded-full text-white hover:bg-[#FF6B9D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-white/20 rounded-lg p-8 cursor-pointer hover:border-[#508CFF] hover:bg-white/5 transition">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-300">Click to upload photo</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={loading} />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-[#FF4D6D] to-[#FF6B9D] text-white font-bold text-lg hover:shadow-lg hover:shadow-[#FF4D6D]/50 transition disabled:opacity-50"
      >
        {loading ? 'Reporting...' : 'Report Emergency'}
      </button>
    </form>
  )
}
