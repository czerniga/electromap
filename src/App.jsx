import React from 'react'
import { LocationProvider, useLocationContext } from './context/LocationContext.jsx'
import useLocations from './hooks/useLocations.js'
import MapView from './components/Map/MapView.jsx'
import ListView from './components/List/ListView.jsx'
import LocationModal from './components/Details/LocationModal.jsx'
import ViewToggle from './components/Layout/ViewToggle.jsx'
import { messages } from './utils/messages.js'

function AppInner() {
  const { loading, error, viewMode, selectedLocation } = useLocationContext()
  useLocations()

  return (
    <div className="h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded shadow p-3">{messages.loading}</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded shadow p-3 text-red-600">{messages.fetchError}</div>
        </div>
      )}
      {!loading && !error && (
        viewMode === 'map' ? <MapView /> : <ListView />
      )}
      {selectedLocation && <LocationModal />}
      <ViewToggle />
    </div>
  )
}

export default function App() {
  return (
    <LocationProvider>
      <AppInner />
    </LocationProvider>
  )
}
