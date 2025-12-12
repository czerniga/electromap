import React, { useCallback } from 'react'
import { useLocationContext } from '../../context/LocationContext.jsx'
import useGeolocation from '../../hooks/useGeolocation.js'
import { Crosshair, X, Search } from 'lucide-react'

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useLocationContext()
  const { requestLocation } = useGeolocation()

  const onChange = useCallback(e => {
    const v = e.target.value.slice(0, 255)
    setSearchQuery(v)
  }, [setSearchQuery])

  return (
    <div className="absolute left-24 right-4 top-4 z-[1000] md:left-auto md:right-4 md:w-[380px]">
      <div className="flex items-center gap-2 rounded-xl bg-white/95 shadow p-2">
        <Search className="w-5 h-5 text-gray-500" aria-hidden />
        <input
          aria-label="Szukaj adresu"
          value={searchQuery}
          onChange={onChange}
          placeholder="Szukaj adresu…"
          className="flex-1 bg-transparent outline-none"
        />
        {searchQuery && (
          <button aria-label="Wyczyść" className="p-1" onClick={() => setSearchQuery('')}>
            <X className="w-5 h-5" />
          </button>
        )}
        <button aria-label="Użyj mojej lokalizacji" className="p-1" onClick={requestLocation}>
          <Crosshair className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
