import { Router } from 'express'
import {
  authenticate,
  getBatch,
  addAddressToBatch,
} from '../services/inconcert'

const router = Router()


router.post('/coverage', async (req, res) => {
  try {

    const BATCH_ID = process.env.INCONCERT_BATCH_ID

    const formData = req.body

    if (!formData?.telefono) {
      return res.status(400).json({
        success: false,
        message: 'El teléfono es obligatorio',
      })
    }

    if (!BATCH_ID) {
      throw new Error('INCONCERT_BATCH_ID no está configurado')
    }

    const token = await authenticate()

    await getBatch(token, BATCH_ID)

    const direccion = `${formData.streetType} ${formData.streetName} ${formData.addressNumber ?? ''}, ${formData.district}, ${formData.province}`

    const referencia = formData.reference ?? ''

    const result = await addAddressToBatch(
      token,
      BATCH_ID,
      formData.telefono,
      {
        departamento: formData.department,
        provincia: formData.province,
        distrito: formData.district,
        ubigeo: formData.ubigeo,
        tipoVivienda: formData.housingType,
        tipoCalle: formData.streetType,
        nombreCalle: formData.streetName,
        tieneNumero: formData.hasNumber,
        numero: formData.addressNumber,
        piso: formData.floor,
        departamentoDomicilio: formData.apartment,
        interior: formData.interior,
        referencia: formData.reference,
        latitud: formData.location?.latitude,
        longitud: formData.location?.longitude,
        "Direccion": direccion,
        "Referencia": referencia
      }
    )

    return res.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Error procesando cobertura:', error)

    return res.status(500).json({
      success: false,
      message: 'No se pudo enviar la información',
    })
  }
})

export default router