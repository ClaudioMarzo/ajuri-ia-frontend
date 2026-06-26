const API_URL = import.meta.env.VITE_API_URL ?? ''

function normalizeChatError(status, messageError) {
  const msg = String(messageError ?? '').toLowerCase()

  if (
    status === 429 ||
    /quota|rate\s*limit|too\s*many\s*requests|exceeded/.test(msg)
  ) {
    return 'O serviço de IA atingiu o limite de uso no momento. Tente novamente em alguns minutos.'
  }

  if (
    status === 503 ||
    /temporariamente indispon[ií]vel|todos os llms falharam/.test(msg)
  ) {
    return 'O serviço de IA está temporariamente indisponível. Tente novamente em instantes.'
  }

  if (status >= 500) {
    return 'O servidor encontrou um problema temporário. Tente novamente em instantes.'
  }

  if (status === 400) {
    return messageError ?? 'Não foi possível processar sua mensagem. Revise o texto e tente novamente.'
  }

  return messageError ?? `Erro ${status}`
}

let bootstrapPromise = null
let bootstrapCache = null

export async function fetchBootstrap({ force = false } = {}) {
  if (!force && bootstrapCache) return bootstrapCache
  if (!force && bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    const res = await fetch(`${API_URL}/api/bootstrap`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    if (!data.success) throw new Error(data.messageError ?? 'Erro ao carregar bootstrap')

    bootstrapCache = data.data
    return bootstrapCache
  })()

  try {
    return await bootstrapPromise
  } finally {
    bootstrapPromise = null
  }
}

export async function fetchProfiles() {
  const data = await fetchBootstrap()
  return data.profiles
}

export async function fetchModels() {
  const data = await fetchBootstrap()
  return data.models // { default: string, models: [{ id, label }] }
}

export async function fetchHealth() {
  try {
    const data = await fetchBootstrap()
    if (typeof data?.health?.online === 'boolean') return data.health.online
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
      onError(normalizeChatError(res.status, data?.messageError))
    } catch {
      onError(normalizeChatError(res.status, null))
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
