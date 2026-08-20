interface AuthResponse {
  token: string
}

export async function authenticate(): Promise<string> {
  const apiUrl = process.env.INCONCERT_API_URL
  const username = process.env.INCONCERT_USER
  const password = process.env.INCONCERT_PASSWORD

  console.log('Inconcert URL:', apiUrl)

  const response = await fetch(`${apiUrl}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: username,
      password,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()

    console.error('Inconcert status:', response.status)
    console.error('Inconcert status text:', response.statusText)
    console.error('Inconcert response:', errorBody)

    throw new Error(
      `Error de autenticación en Inconcert: ${response.status} ${response.statusText}`
    )
  }

  const data: AuthResponse = await response.json()

  if (!data.token) {
    throw new Error('Inconcert no devolvió un token')
  }

  return data.token
}

interface BatchResponse {
  data: unknown
}

export async function getBatch(
  token: string,
  batchId: string
): Promise<BatchResponse> {
  const apiUrl = process.env.INCONCERT_API_URL

  const response = await fetch(
    `${apiUrl}/batch_management/get_batch/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        campaign: 'test_instalacioneswin@win2',
        account:
          'WHATSAPP_test_instalacioneswin@win2_4E22EECA385F1092DE5A291E14505B72',
        account_Name: 'WHATSAPP_test_instalacioneswin',
        batchId,
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()

    console.error('Get batch status:', response.status)
    console.error('Get batch response:', errorBody)

    throw new Error(
      `Error obteniendo el batch: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  return data
}

export async function addAddressToBatch(
  token: string,
  batchId: string,
  telefono: string,
  data: Record<string, unknown>
): Promise<unknown> {
  const apiUrl = process.env.INCONCERT_API_URL

  const response = await fetch(
    `${apiUrl}/batch_management/add_address_to_batch/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'WHATSAPP',
        campaign: 'test_instalacioneswin@win2',
        account:
          'WHATSAPP_test_instalacioneswin@win2_4E22EECA385F1092DE5A291E14505B72',
        account_Name: 'WHATSAPP_test_instalacioneswin',
        batchId,
        address: telefono,
        data,
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()

    console.error('Add address status:', response.status)
    console.error('Add address response:', errorBody)

    throw new Error(
      `Error agregando la dirección al batch: ${response.status} ${response.statusText}`
    )
  }

  console.log('Add address response status:', response)

  return await response.json()
}