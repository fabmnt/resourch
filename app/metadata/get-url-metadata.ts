import { JSDOM } from 'jsdom'

export interface URLMetadata {
  title?: string
  description?: string
  iconURL?: string
}

export async function getUrlMetadata(url: string): Promise<URLMetadata> {
  const siteURL = new URL(url)
  const html = await fetch(siteURL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Cache-Control': 'no-cache',
    },
  }).then((response) => response.text())
  const { window } = new JSDOM()
  const parser = new window.DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const title =
    doc.head.querySelector('meta[name="title"]')?.getAttribute('content') ??
    doc.querySelector('title')?.textContent ??
    undefined
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? undefined
  const faviconsServiceUrl = new URL('https://www.google.com/s2/favicons')
  faviconsServiceUrl.searchParams.set('domain', siteURL.hostname)
  faviconsServiceUrl.searchParams.set('sz', '64')

  return {
    title,
    description,
    iconURL: faviconsServiceUrl.toString(),
  }
}
