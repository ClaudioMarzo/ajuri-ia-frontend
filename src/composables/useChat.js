import { ref } from 'vue'
import { streamChat } from '../services/api.js'

export function useChat() {
  const messages = ref([])
  const isStreaming = ref(false)
  const error = ref(null)

  async function sendMessage(profileId, text) {
    if (isStreaming.value || !text.trim()) return

    error.value = null
    messages.value.push({ role: 'user', content: text, llmUsed: null })

    const aiMsg = { role: 'ai', content: '', llmUsed: null }
    messages.value.push(aiMsg)
    isStreaming.value = true

    await streamChat(profileId, text, {
      onChunk(chunk) {
        aiMsg.content += chunk
      },
      onDone(meta) {
        aiMsg.llmUsed = meta?.llmUsed ?? null
        isStreaming.value = false
      },
      onError(msg) {
        messages.value.pop()
        error.value = msg
        isStreaming.value = false
      }
    })
  }

  function clearMessages() {
    messages.value = []
    error.value = null
    isStreaming.value = false
  }

  return { messages, isStreaming, error, sendMessage, clearMessages }
}
