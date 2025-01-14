'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className='flex items-center gap-2'>
      <Button
        className='rounded-md hover:no-underline'
        variant='link'
        asChild
      >
        <Link
          href='/'
          className={cn(pathname === '/' && 'bg-muted shadow-none')}
        >
          Featured
        </Link>
      </Button>
      <Button
        className='rounded-md hover:no-underline'
        variant='link'
        asChild
      >
        <Link
          href='/recent'
          className={cn(pathname === '/recent' && 'bg-muted shadow-none')}
        >
          Recent
        </Link>
      </Button>
    </nav>
  )
}
