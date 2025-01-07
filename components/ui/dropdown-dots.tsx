import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'

export function DropdownDots({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='rounded-full shadow-none'
          aria-label='Open dropdown menu'
        >
          <Ellipsis
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
