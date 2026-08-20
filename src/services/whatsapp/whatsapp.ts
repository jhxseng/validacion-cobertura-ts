import type { CoverageFormData } from '../../types/coverage'

export async function sendCoverageData(
  formData: CoverageFormData
): Promise<void> {
  const response = await fetch(
    'http://localhost:3000/api/whatsapp/coverage',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => null)

    throw new Error(
      error?.message ?? 'No se pudo enviar la información'
    )
  }
}