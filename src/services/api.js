const API_URL = import.meta.env.VITE_API_URL

export async function fetchProfiles() {
  const res = await fetch(`${API_URL}/api/profiles`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.messageError ?? 'Erro ao carregar perfis')
  return data.data
}

export async function streamChat(profileId, message, { onChunk, onDone, onError }) {
  let res
  try {
    res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, message })
    })
  } catch {
    onError('Erro de conexão. Verifique sua internet.')
    return
  }

  if (!res.ok) {
    try {
      const data = await res.json()
      onError(data.messageError ?? `Erro ${res.status}`)
    } catch {
      onError(`Erro ${res.status}`)
    }
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let doneReceived = false

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (!payload) continue

        if (payload.startsWith('[DONE]')) {
          doneReceived = true
          try {
            const meta = JSON.parse(payload.slice(7))
            onDone(meta.data ?? null)
          } catch {
            onDone(null)
          }
        } else {
          onChunk(payload)
        }
      }
    }

    if (!doneReceived) onDone(null)
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError('Conexão interrompida.')
    }
  }
}
