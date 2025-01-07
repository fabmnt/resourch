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
        className='rounded-md'
        variant='outline'
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
        variant='outline'
        asChild
      >
        <Link
          href='/recent'
          className={cn(pathname === '/recent' && 'bg-muted shadow-none')}
        >
          Recent
        </Link>
      </Button>
      <Button
        variant='outline'
        asChild
      >
        <Link
          href='/all'
          className={cn(pathname === '/all' && 'bg-muted shadow-none')}
        >
          All
        </Link>
      </Button>
    </nav>
  )
}
;<Tabs defaultValue='tab-1'>
  <TabsList className='bg-transparent'>
    <TabsTrigger
      value='tab-1'
      className='data-[state=active]:bg-muted data-[state=active]:shadow-none'
    >
      Tab 1
    </TabsTrigger>
    <TabsTrigger
      value='tab-2'
      className='data-[state=active]:bg-muted data-[state=active]:shadow-none'
    >
      Tab 2
    </TabsTrigger>
    <TabsTrigger
      value='tab-3'
      className='data-[state=active]:bg-muted data-[state=active]:shadow-none'
    >
      Tab 3
    </TabsTrigger>
  </TabsList>
</Tabs>
