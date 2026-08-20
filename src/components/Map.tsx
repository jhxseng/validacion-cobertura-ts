import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/map.css'

interface MapProps {
  onLocationChange: (latitude: number, longitude: number) => void
  selectedLocation?: {
    latitude: number
    longitude: number
  } | null
}
function Map({
  onLocationChange,
  selectedLocation,
}: MapProps) {

  const mapContainer = useRef<HTMLDivElement | null>(null)

  const map = useRef<mapboxgl.Map | null>(null)

  const isMovingToSelectedLocation = useRef(false)

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-77.0428, -12.0464],
      zoom: 12,
    })

    if (isMovingToSelectedLocation.current) {
      isMovingToSelectedLocation.current = false
      return
    }

    map.current.on('moveend', () => {
      const center = map.current?.getCenter()

      if (!center) return

      onLocationChange(center.lat, center.lng)
    })

  }, [])

  useEffect(() => {
    if (!map.current || !selectedLocation) return

    const currentCenter = map.current.getCenter()

    const sameLocation =
      Math.abs(currentCenter.lat - selectedLocation.latitude) < 0.00001 &&
      Math.abs(currentCenter.lng - selectedLocation.longitude) < 0.00001

    if (sameLocation) return

    isMovingToSelectedLocation.current = true

    map.current.flyTo({
      center: [
        selectedLocation.longitude,
        selectedLocation.latitude,
      ],
      zoom: 16,
    })
  }, [selectedLocation])

  return (
    <div className="map-wrapper">
      <div
        ref={mapContainer}
        className="map-container"
      />

      <div className="map-marker">
        📍
      </div>
    </div>
  )
}

export default Map