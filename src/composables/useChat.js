import { ref } from 'vue'
import { streamChat } from '../services/api.js'

export function useChat() {
  const messages    = ref([])
  const isStreaming = ref(false)
  const error       = ref(null)

  let abortController = null

  // model: id do modelo escolhido pelo usuário (undefined = default do servidor)
  async function sendMessage(profileId, text, model) {
    if (isStreaming.value || !text.trim()) return

    error.value = null
    messages.value.push({ role: 'user', content: text })

    const aiMsg = { role: 'ai', content: '', llmUsed: null, requestedModel: model ?? null }
    messages.value.push(aiMsg)
    isStreaming.value = true

    abortController = new AbortController()

    await streamChat(profileId, text, model, {
      signal: abortController.signal,
      onChunk(chunk) {
        aiMsg.content += chunk
      },
      onDone(meta) {
        aiMsg.llmUsed = meta?.llmUsed ?? null
        isStreaming.value = false
        abortController = null
      },
      onError(msg) {
        messages.value.pop()
        error.value = msg
        isStreaming.value = false
        abortController = null
      },
    })
  }

  function stop() {
    abortController?.abort()
    abortController = null
    isStreaming.value = false
  }

  function clearMessages() {
    stop()
    messages.value = []
    error.value = null
  }

  return { messages, isStreaming, error, sendMessage, stop, clearMessages }
}
