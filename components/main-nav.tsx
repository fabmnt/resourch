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
        className='rounded-none hover:no-underline border-b-2 border-transparent'
        variant='link'
        asChild
      >
        <Link
          href='/'
          className={cn(pathname === '/' && '!border-primary')}
        >
          Featured
        </Link>
      </Button>
      <Button
        className='rounded-none hover:no-underline border-b-2 border-transparent'
        variant='link'
        asChild
      >
        <Link
          href='/recent'
          className={cn(pathname === '/recent' && '!border-primary')}
        >
          My resources
        </Link>
      </Button>
    </nav>
  )
}
