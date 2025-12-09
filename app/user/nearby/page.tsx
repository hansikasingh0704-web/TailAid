'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Navigation, Search, Map, MessageSquare, Mail, X } from 'lucide-react'
import NearbyMap from '@/components/nearby-map'

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 })
  const [facilities, setFacilities] = useState<any[]>([])
  const [selectedFacility, setSelectedFacility] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

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

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/facilities')
        const data = await response.json()
        
        const transformedFacilities = (data || []).map((facility: any) => ({
          id: facility._id,
          name: facility.name,
          type: facility.role === 'hospital' ? 'Hospital' : facility.role === 'rescue_center' ? 'Rescue Center' : 'Facility',
          address: facility.address || 'Address not provided',
          phone: facility.phone || 'Phone not provided',
          email: facility.email || 'Email not provided',
          lat: facility.lat || 40.7128 + Math.random() * 0.1,
          lng: facility.lng || -74.006 + Math.random() * 0.1,
          distance: Math.round(Math.random() * 8 + 1),
          rating: (Math.random() * 1 + 4.5).toFixed(1),
        }))
        setFacilities(transformedFacilities)
      } catch (error) {
        console.error('[v0] Error fetching facilities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [])

  const filtered = facilities
    .filter((f) => filterType === 'all' || (
      (filterType === 'Hospital' && f.type === 'Hospital') ||
      (filterType === 'Rescue Center' && f.type === 'Rescue Center')
    ))
    .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.distance - b.distance)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-white">Find Nearby Help</h1>
          <p className="text-gray-400 text-sm">Click on any facility to view details and contact information</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Search & List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#508CFF] focus:bg-white/10 transition"
                  placeholder="Search facility..."
                />
              </div>

              {/* Filter */}
              <div className="space-y-2">
                {['all', 'Hospital', 'Rescue Center'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      filterType === type
                        ? 'bg-gradient-to-r from-[#508CFF] to-[#00E0B8] text-white font-semibold'
                        : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {type === 'all' ? 'All Facilities' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {loading ? (
                <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-6 text-center">
                  <p className="text-gray-400 text-sm">Loading facilities...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-6 text-center">
                  <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No facilities found</p>
                </div>
              ) : (
                filtered.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => {
                      setSelectedFacility(facility)
                      setShowModal(true)
                    }}
                    className={`w-full text-left backdrop-blur-md border rounded-xl p-4 transition cursor-pointer ${
                      selectedFacility?.id === facility.id
                        ? 'bg-white/10 border-[#508CFF] ring-2 ring-[#508CFF]/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-[#508CFF]/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{facility.name}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-[#00E0B8]/20 text-[#00E0B8]">
                        {facility.distance} km
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{facility.type}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        {'★'.repeat(Math.floor(parseFloat(facility.rating)))}
                        <span className="text-gray-400">{facility.rating}</span>
                      </div>
                      <span className="text-xs text-[#00E0B8]">Click for details →</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Map & Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map */}
            <NearbyMap userLocation={userLocation} facilities={facilities} selectedFacility={selectedFacility} />

            {/* Facility Details - Desktop View */}
            {selectedFacility && !showModal && (
              <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-6 hidden lg:block">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedFacility.name}</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#508CFF]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#508CFF]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                      <p className="text-white">{selectedFacility.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00E0B8]/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#00E0B8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                      <a href={`tel:${selectedFacility.phone}`} className="text-white hover:text-[#00E0B8] transition">
                        {selectedFacility.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/20 flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-5 h-5 text-[#FF4D6D]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Distance</p>
                      <p className="text-white">{selectedFacility.distance} km away</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00E0B8]/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#00E0B8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                      <a href={`mailto:${selectedFacility.email}`} className="text-white hover:text-[#00E0B8] transition">
                        {selectedFacility.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 max-w-lg w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedFacility.name}</h2>
                <p className="text-[#00E0B8] text-sm mt-1">{selectedFacility.type}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#508CFF]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#508CFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-white">{selectedFacility.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00E0B8]/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#00E0B8]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                  <a href={`tel:${selectedFacility.phone}`} className="text-white hover:text-[#00E0B8] transition">
                    {selectedFacility.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF4D6D]/20 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-[#FF4D6D]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Distance</p>
                  <p className="text-white">{selectedFacility.distance} km away</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00E0B8]/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#00E0B8]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${selectedFacility.email}`} className="text-white hover:text-[#00E0B8] transition">
                    {selectedFacility.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                {'★'.repeat(Math.floor(parseFloat(selectedFacility.rating)))}
                <span className="text-gray-400">{selectedFacility.rating}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-[#00E0B8] to-[#00B894] text-[#0D0D0D] font-bold hover:shadow-lg hover:shadow-[#00E0B8]/50 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
