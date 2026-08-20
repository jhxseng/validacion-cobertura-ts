import Button from "../../components/Button"
import Input from '../../components/Input'
import Map from '../../components/Map'
import type { LocationData } from '../../types/location'
import { reverseGeocode, autocompleteAddress, type AutocompleteResult } from '../../services/map/geocoding'
import { useState, useEffect, useRef } from 'react'

interface LocationStepProps {
  onConfirm: (location: LocationData) => void
}

function LocationStep({ onConfirm }: LocationStepProps) {

  const [location, setLocation] = useState<LocationData | null>(null)
  const [addressInput, setAddressInput] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [selectedAddress, setSelectedAddress] = useState<AutocompleteResult | null>(null)
  const isMapAddressChange = useRef(false)

  useEffect(() => {

    if (isMapAddressChange.current) {
      isMapAddressChange.current = false
      setSuggestions([])
      return
    }

    if (addressInput.trim().length < 5) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const results = await autocompleteAddress(addressInput)

        setSuggestions(results)


      } catch (error) {
        console.error('Error en autocomplete:', error)
        setSuggestions([])
      }
    }, 500)

    return () => clearTimeout(timeout)

  }, [addressInput])

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
        streetName: result.streetName
      }

      setLocation(updatedLocation)
      onConfirm(updatedLocation)

    } catch (error) {
      console.error('Error en reverse geocoding:', error)
    }
  }



  return (
    <section className="coverage-step">

      <h2 className="coverage-title">
        ¿Dónde deseas instalar tu servicio?
      </h2>

      <p className="coverage-description">
        Selecciona tu ubicación en el mapa o busca tu dirección.
      </p>

      <div className="form-field">
        <Input
          placeholder="Ingresa tu dirección"
          value={addressInput}
          onChange={setAddressInput}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="address-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                console.log('Dirección seleccionada:', suggestion)
                setAddressInput(suggestion.address)
                setSelectedAddress(suggestion)
                setSuggestions([])
              }}
            >
              {suggestion.address}

            </button>
          ))}
        </div>
      )

      }

      <Map
        selectedLocation={selectedAddress}
        onLocationChange={async (lat, lng) => {
          try {
            const result = await reverseGeocode(lat, lng)

            console.log('Dirección del mapa:', result)

            isMapAddressChange.current = true

            setAddressInput(result.address)

            setLocation({
              address: result.address,
              latitude: lat,
              longitude: lng,
              department: result.department,
              province: result.province,
              district: result.district,
              streetName: result.streetName
            })

          } catch (error) {
            console.error('Error obteniendo dirección:', error)
          }
        }}
      />

      <div className="form-field">
        <Button onClick={handleConfirmAddress}>
          Confirmar dirección
        </Button>
      </div>

    </section>
  )
}

export default LocationStep