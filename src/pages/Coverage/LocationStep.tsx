import Button from "../../components/Button"
import Input from '../../components/Input'
import Map from '../../components/Map'
import { useState } from 'react'

function LocationStep() {

const [address, setAddress] = useState('')

const handleConfirmAddress = () => {
  console.log('Dirección confirmada:', address)
}

  return (
    <section>
      <h2>¿Dónde deseas instalar tu servicio?</h2>

      <p>
        Selecciona tu ubicación en el mapa o busca tu dirección.
      </p>

      <Input 
        placeholder="Ingresa tu dirección"
        value={address}
        onChange={setAddress}
        >
      </Input>

      <Map></Map>

      <Button onClick={handleConfirmAddress}>
        Confirmar dirección
      </Button>

    </section>
  )
}

export default LocationStep