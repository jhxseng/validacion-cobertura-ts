import type { CoverageFormData } from '../../types/coverage'

export async function sendCoverageData(
  formData: CoverageFormData
): Promise<void> {
  const apiUrl = import.meta.env.VITE_API_URL
  
  const response = await fetch(
    `${apiUrl}/api/whatsapp/coverage`,
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