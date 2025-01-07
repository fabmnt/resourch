'use client'
import { DropdownDots } from '@/components/ui/dropdown-dots'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { deleteResourceAction } from '../actions'
import { Trash } from 'lucide-react'
import { Tables } from '@/database.types'

export function ResourceMenu({ resource }: { resource: Tables<'resources'> }) {
  return (
    <DropdownDots>
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
