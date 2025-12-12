import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [userPosition, setUserPosition] = useState(null)
  const [geolocationError, setGeolocationError] = useState(null)

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('elektromap_preferred_view') || 'map')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('elektromap_preferred_view', viewMode)
  }, [viewMode])

  const value = useMemo(() => ({
    locations, setLocations,
    loading, setLoading,
    error, setError,
    userPosition, setUserPosition,
    geolocationError, setGeolocationError,
    selectedLocation, setSelectedLocation,
    viewMode, setViewMode,
    searchQuery, setSearchQuery
  }), [locations, loading, error, userPosition, geolocationError, selectedLocation, viewMode, searchQuery])

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocationContext() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocationContext must be used within LocationProvider')
  return ctx
}
