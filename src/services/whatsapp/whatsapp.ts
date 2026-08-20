import type { CoverageFormData } from '../../types/coverage'

export async function sendCoverageData(
  formData: CoverageFormData
): Promise<void> {
  const response = await fetch('/api/whatsapp/coverage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error('No se pudo enviar la información')
  }
}