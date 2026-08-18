import Button from "../../components/Button"
import Input from '../../components/Input'
import Map from '../../components/Map'
import type { LocationData } from '../../types/location'
import { reverseGeocode } from '../../services/map/geocoding'
import { useState } from 'react'

interface LocationStepProps {
  onConfirm: (location: LocationData) => void
}

function LocationStep({ onConfirm }: LocationStepProps) {

  const [location, setLocation] = useState<LocationData | null>(null)

  const handleConfirmAddress = async () => {
    if (location === null) {
      console.log('No hay coordenadas seleccionadas')
      return
    }

    try {
      const result = await reverseGeocode(location.latitude, location.longitude)

      console.log('Respuesta Geoapify:', result)

      const updatedLocation: LocationData = {
        ...location,
        address: result.address,
        department: result.department,
        province: result.province,
        district: result.district,
      }

      setLocation(updatedLocation)
      onConfirm(updatedLocation)

    } catch (error) {
      console.error('Error en reverse geocoding:', error)
    }
  }

  return (
    <section>
      <h2>¿Dónde deseas instalar tu servicio?</h2>

      <p>
        Selecciona tu ubicación en el mapa o busca tu dirección.
      </p>

      <Input
        placeholder="Ingresa tu dirección"
      //value={location.address}
      //onChange={setAddress}

      >
      </Input>

      <Map
        onLocationChange={(lat, lng) => {
          setLocation((current) => ({
            address: current?.address ?? '',
            latitude: lat,
            longitude: lng,
            department: current?.department ?? '',
            province: current?.province ?? '',
            district: current?.district ?? '',
          }))
        }}
      />

      <Button onClick={handleConfirmAddress}>
        Confirmar dirección
      </Button>

    </section>
  )
}

export default LocationStep