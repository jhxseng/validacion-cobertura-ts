import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import whatsappRouter from './routes/whatsapp'

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

app.use('/api/whatsapp', whatsappRouter)

app.get('/api/test-inconcert', async (_req, res) => {
  try {
    const response = await fetch(
      'https://win2.i6.inconcert.cloud/inconcert/api'
    )

    const text = await response.text()

    res.json({
      ok: true,
      status: response.status,
      response: text,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: String(error),
    })
  }
})

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend ejecutándose en el puerto ${PORT}`)
})