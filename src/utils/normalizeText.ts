export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
}

export function normalizeProvince(province: string): string {
    const normalized = normalizeText(province)

    if (normalized === 'LIMA METROPOLITANA') {
        return 'LIMA'
    }

    if (normalized.startsWith('PROVINCIA DE ')) {
        return normalized.replace('PROVINCIA DE ', '')
    }

    return normalized
}