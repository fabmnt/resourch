import { JSDOM } from 'jsdom'

export interface URLMetadata {
  title?: string
  description?: string
  iconURL?: string
}

export async function getUrlMetadata(url: string): Promise<URLMetadata> {
  const html = await fetch(url).then((response) => response.text())
  const { window } = new JSDOM()
  const parser = new window.DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const title = doc.querySelector('title')?.textContent ?? undefined
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? undefined
  const headLinks = doc.head.getElementsByTagName('link')
  let iconURL: string | undefined
  for (const link of Array.from(headLinks)) {
    const rel = link.getAttribute('rel')
    if (rel == null) {
      continue
    }

    if (rel.includes('icon') || rel.includes('shortcut icon')) {
      iconURL = link.getAttribute('href') ?? undefined
      break
    }
  }

  return {
    title,
    description,
    iconURL,
  }
}
