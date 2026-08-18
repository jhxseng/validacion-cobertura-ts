import { useRef , useEffect} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/map.css'

interface MapProps {
  onLocationChange: (latitude: number, longitude: number) => void
}

function Map({ onLocationChange }: MapProps) {

    const mapContainer = useRef<HTMLDivElement | null>(null)

    const map = useRef<mapboxgl.Map | null>(null)
    
    useEffect(() => {
      const token = import.meta.env.VITE_MAPBOX

      mapboxgl.accessToken = token

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-77.0428, -12.0464],
        zoom: 12,
    })

    map.current.on('moveend', () => {
      const center = map.current?.getCenter()

      if (!center) return

      onLocationChange(center.lat, center.lng)
    })
      
    }, [])

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