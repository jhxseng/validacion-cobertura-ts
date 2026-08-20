import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticate, getBatch, addAddressToBatch } from './services/inconcert'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend funcionando',
  })
})

app.get('/api/test/inconcert', async (_req, res) => {
  try {
    const token = await authenticate()

    res.json({
      success: true,
      tokenReceived: Boolean(token),
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Error autenticando con Inconcert',
    })
  }
})



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`)
})

app.get('/api/test/inconcert/batch', async (_req, res) => {
  try {
    const token = await authenticate()

    const batch = await getBatch(
      token,
      'ValidacionCobertura_test'
    )

    console.log('Respuesta de get batch:', batch)

    res.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Error obteniendo el batch',
    })
  }
})

app.get('/api/test/inconcert/add-address', async (_req, res) => {
  try {
    const token = await authenticate()

    const batchId = 'ValidacionCobertura_test'

    await getBatch(token, batchId)

    const result = await addAddressToBatch(
      token,
      batchId,
      '51977907582',
      'Av. Prueba 123',
      'Prueba de integración',
      {
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Ate',
        ubigeo: '150103',
        tipoVivienda: 'Casa',
        tipoCalle: 'Avenida',
        nombreCalle: 'Prueba',
        tieneNumero: true,
        numero: '123',
        piso: '',
        departamentoDomicilio: '',
        interior: '',
        referencia: 'Prueba de integración',
        latitud: -12.0464,
        longitud: -77.0428,
      }
    )

    console.log('Respuesta add address:', result)

    res.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Error agregando dirección al batch',
    })
  }
})