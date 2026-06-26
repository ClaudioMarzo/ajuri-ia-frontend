const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function fetchProfiles() {
  const res = await fetch(`${API_URL}/api/profiles`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.messageError ?? 'Erro ao carregar perfis')
  return data.data
}

export async function fetchModels() {
  const res = await fetch(`${API_URL}/api/models`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.messageError ?? 'Erro ao carregar modelos')
  return data.data // { default: string, models: [{ id, label }] }
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return false

    const data = await res.json().catch(() => null)
    if (data && typeof data.success === 'boolean') return data.success
    return true
  } catch {
    return false
  }
}

// model: id do modelo escolhido (opcional — undefined usa o default do servidor)
// signal: AbortSignal para cancelamento via AbortController
export async function streamChat(profileId, message, model, { onChunk, onDone, onError, signal }) {
  let res
  try {
    res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, message, ...(model ? { model } : {}) }),
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') return
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
        if (!line.startsWith('data:')) continue

        let payload = line.slice(5)
        if (payload.startsWith(' ')) payload = payload.slice(1)
        payload = payload.replace(/\r$/, '')

        const control = payload.trim()
        if (control.startsWith('[DONE]')) {
          doneReceived = true
          try {
            const meta = JSON.parse(control.slice(7))
            onDone(meta.data ?? null)
          } catch {
            onDone(null)
          }
        } else if (payload.length) {
          onChunk(payload.replace(/\\n/g, '\n'))
        }
      }

      await new Promise(r => setTimeout(r, 0))
    }

    if (!doneReceived) onDone(null)
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError('Conexão interrompida.')
    }
  }
}
