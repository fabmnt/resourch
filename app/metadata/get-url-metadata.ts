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
  const title =
    doc.head.querySelector('meta[name="title"]')?.getAttribute('content') ??
    doc.querySelector('title')?.textContent ??
    undefined
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? undefined
  let iconURL =
    doc.head.querySelector('link[rel="icon"]')?.getAttribute('href') ??
    doc.head.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ??
    doc.head.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ??
    undefined

  if (iconURL == null) {
    const faviconURL = new URL('/favicon.ico', url).toString()
    const response = await fetch(faviconURL)
    if (response.ok) {
      iconURL = faviconURL
    }
  }

  return {
    title,
    description,
    iconURL,
  }
}
