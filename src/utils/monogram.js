// Conectores que não contam como "palavra significativa" no monograma.
const STOPWORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o'])

/**
 * Deriva um monograma curto a partir do nome do perfil, para substituir os
 * emojis nos avatares. Ignora pontuação e conectores.
 * Ex.: "Professor / Educador" -> "PE", "Produtor de Guaraná" -> "PG",
 *      "Empreendedor" -> "Em".
 *
 * @param {string} nome
 * @returns {string} 1-2 caracteres
 */
export function monogram(nome) {
  const clean = (nome ?? '').trim()
  if (!clean) return '·'

  // Mantém só letras (inclui acentos) e espaços; descarta "/", "-", etc.
  const words = clean
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const significant = words.filter(w => !STOPWORDS.has(w.toLowerCase()))
  const pool = significant.length ? significant : words

  if (pool.length >= 2) {
    return (pool[0][0] + pool[1][0]).toUpperCase()
  }
  // Palavra única: primeira maiúscula + segunda minúscula
  const w = pool[0] ?? clean
  return (w[0].toUpperCase() + (w[1] ?? '').toLowerCase())
}

/**
 * Tint do monograma alternando por índice: floresta / coral.
 * @param {number} index
 * @returns {'monogram--floresta' | 'monogram--coral'}
 */
export function monogramTint(index = 0) {
  return index % 2 === 0 ? 'monogram--floresta' : 'monogram--coral'
}
