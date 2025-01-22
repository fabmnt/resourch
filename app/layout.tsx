import { ThemeProvider } from 'next-themes'
import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { SharedDialog } from './(resources)/components/shared-dialog'
import { Suspense } from 'react'
import { ShareResourceDialog } from './(resources)/components/share-resource-dialog'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Resourch',
  description: 'A site where you can save your links and resources.',
}

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={geistSans.className}
      suppressHydrationWarning
    >
      <body className='scroll-smooth bg-background text-foreground'>
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <main className='min-h-screen'>{children}</main>
            <Suspense>
              <SharedDialog />
              <ShareResourceDialog />
            </Suspense>
          </ThemeProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}
