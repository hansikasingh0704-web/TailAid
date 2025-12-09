'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, AlertCircle, Heart, Clock } from 'lucide-react'

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyFacilities, setNearbyFacilities] = useState<any[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00E0B8] to-[#00B894] flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#0D0D0D]" />
            </div>
            <h1 className="text-2xl font-bold text-white">TailAid</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#508CFF] to-[#00E0B8] text-white font-semibold hover:shadow-lg hover:shadow-[#508CFF]/50 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
            Help is Just One Click Away
          </h2>
          <p className="text-xl text-gray-400 mb-8 text-balance">
            Connect injured animals with rescue centers and veterinary hospitals in real-time
          </p>
          <Link href="/signup" className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF6B9D] text-white font-bold text-lg hover:shadow-lg hover:shadow-[#FF4D6D]/50 transition">
            Report Emergency
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: AlertCircle, title: 'Real-Time Alerts', description: 'Instant notifications to nearby rescue centers' },
            { icon: MapPin, title: 'Find Nearby Help', description: 'Locate hospitals and rescue centers near you' },
            { icon: Clock, title: 'Track Progress', description: 'Monitor your rescue request in real-time' },
          ].map((feature, i) => (
            <div key={i} className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-8 hover:bg-white/10 transition">
              <feature.icon className="w-12 h-12 text-[#00E0B8] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
