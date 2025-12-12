import { useEffect } from 'react'
import { useLocationContext } from '../context/LocationContext.jsx'

export default function useLocations() {
  const { setLocations, setLoading, setError } = useLocationContext()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const res = await fetch('/data/locations.json')
        if (!res.ok) throw new Error('Nie udało się pobrać danych')
        const json = await res.json()
        if (!cancelled) setLocations(json.locations || [])
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [setLocations, setLoading, setError])
}
