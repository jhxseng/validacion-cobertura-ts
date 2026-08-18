import type { UbigeoData } from '../../types/ubigeo'

export async function getUbigeos(): Promise<UbigeoData> {
  const response = await fetch(
    'https://free.e-api.net.pe/ubigeos.json'
  )

  if (!response.ok) {
    throw new Error('No se pudieron obtener los ubigeos')
  }

  return response.json()
}