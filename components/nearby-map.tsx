'use client'

import { useEffect, useRef } from 'react'
import { MapPin, Navigation, Map } from 'lucide-react'

interface NearbyMapProps {
  userLocation: { lat: number; lng: number }
  facilities: any[]
  selectedFacility: any
}

export default function NearbyMap({ userLocation, facilities, selectedFacility }: NearbyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // Calculate bounds
    const allPoints = [userLocation, ...facilities]
    const lats = allPoints.map((p) => p.lat)
    const lngs = allPoints.map((p) => p.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const latRange = maxLat - minLat || 0.01
    const lngRange = maxLng - minLng || 0.01

    const toX = (lng: number) => {
      return padding + ((lng - minLng) / lngRange) * (width - 2 * padding)
    }

    const toY = (lat: number) => {
      return height - padding - ((lat - minLat) / latRange) * (height - 2 * padding)
    }

    // Draw background
    ctx.fillStyle = '#0D0D0D'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const x = padding + ((width - 2 * padding) / 5) * i
      const y = padding + ((height - 2 * padding) / 5) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw borders
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 2
    ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding)

    // Draw facilities
    facilities.forEach((facility) => {
      const x = toX(facility.lng)
      const y = toY(facility.lat)

      const isSelected = selectedFacility?.id === facility.id

      // Draw circle
      ctx.fillStyle = facility.type === 'Hospital' ? 'rgba(80, 140, 255, 0.3)' : 'rgba(0, 224, 184, 0.3)'
      ctx.beginPath()
      ctx.arc(x, y, isSelected ? 15 : 10, 0, Math.PI * 2)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = facility.type === 'Hospital' ? '#508CFF' : '#00E0B8'
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.beginPath()
      ctx.arc(x, y, isSelected ? 15 : 10, 0, Math.PI * 2)
      ctx.stroke()

      // Draw icon text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(facility.type === 'Hospital' ? 'H' : 'R', x, y)
    })

    // Draw user location
    const userX = toX(userLocation.lng)
    const userY = toY(userLocation.lat)

    ctx.fillStyle = 'rgba(255, 77, 109, 0.3)'
    ctx.beginPath()
    ctx.arc(userX, userY, 12, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#FF4D6D'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(userX, userY, 12, 0, Math.PI * 2)
    ctx.stroke()

    // Draw inner dot
    ctx.fillStyle = '#FF4D6D'
    ctx.beginPath()
    ctx.arc(userX, userY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw legend
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('H = Hospital  |  R = Rescue Center  |  • = Your Location', width / 2, height - 20)
  }, [userLocation, facilities, selectedFacility])

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5 text-[#508CFF]" />
        <h3 className="font-bold text-white">Location Map</h3>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="w-full border border-white/10 rounded-lg bg-black/20"
      />
    </div>
  )
}
