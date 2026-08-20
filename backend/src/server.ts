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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`)
})