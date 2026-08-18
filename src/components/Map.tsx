import { useRef , useEffect} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

function Map() {

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
      
    }, [])

  return (
    <div 
    ref={mapContainer}
    style={{ width: '100%', height: '400px' }}
    />
  )
}

export default Map