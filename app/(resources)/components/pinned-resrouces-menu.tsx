'use client'
import { DropdownDots } from '@/components/ui/dropdown-dots'
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tables } from '@/database.types'
import { Minus } from 'lucide-react'
import { unpinAllResourcesAction, unpinResourceAction } from '../actions'

interface PinnedResourcesMenuProps {
  resources: Tables<'resources'>[]
}

export function PinnedResourcesMenu({ resources }: PinnedResourcesMenuProps) {
  return (
    <DropdownDots>
      <DropdownMenuLabel>Unpin resources</DropdownMenuLabel>
      <ScrollArea className='h-36 md:h-52 md:pr-4'>
        {resources.map((resource) => (
          <DropdownMenuItem
            onClick={() => unpinResourceAction(resource.id)}
            key={resource.id}
            className='flex text-sm items-center justify-between gap-2'
          >
            <div className='flex flex-col'>
              <span className='truncate max-w-[20ch]'>{resource.title}</span>
            </div>
            <Minus
              size={16}
              strokeWidth={4}
              className='text-red-600'
            />
          </DropdownMenuItem>
        ))}
      </ScrollArea>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => unpinAllResourcesAction()}>Unpin all</DropdownMenuItem>
    </DropdownDots>
  )
}
