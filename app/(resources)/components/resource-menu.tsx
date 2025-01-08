'use client'
import { DropdownDots } from '@/components/ui/dropdown-dots'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { addResourceToPinnedAction, deleteResourceAction } from '../actions'
import { Pin, Trash } from 'lucide-react'
import { Tables } from '@/database.types'

export function ResourceMenu({ resource }: { resource: Tables<'resources'> }) {
  return (
    <DropdownDots>
      {!resource.is_pinned && (
        <DropdownMenuItem
          onClick={() => addResourceToPinnedAction(resource.id)}
          className='flex gap-2 items-center'
        >
          <Pin
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
          Pin to top
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={() => deleteResourceAction(resource.id)}
        className='flex gap-2 items-center text-red-700'
      >
        <Trash
          size={16}
          strokeWidth={2}
          aria-hidden='true'
        />
        Delete
      </DropdownMenuItem>
    </DropdownDots>
  )
}
