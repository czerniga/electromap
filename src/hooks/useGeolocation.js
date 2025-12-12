import { useCallback } from 'react'
import { useLocationContext } from '../context/LocationContext.jsx'

export default function useGeolocation() {
  const { setUserPosition, setGeolocationError } = useLocationContext()

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeolocationError('Geolokalizacja nie jest wspierana w tej przeglądarce')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setUserPosition({ lat: latitude, lng: longitude })
        setGeolocationError(null)
      },
      err => {
        setGeolocationError(err.message || 'Nie udało się uzyskać lokalizacji')
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )
  }, [setUserPosition, setGeolocationError])

  return { requestLocation }
}
