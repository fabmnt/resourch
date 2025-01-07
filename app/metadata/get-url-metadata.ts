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
  const icon = doc.querySelector('link[rel="icon"]')?.getAttribute('href') ?? undefined
  return {
    title,
    description,
    iconURL: icon,
  }
}
