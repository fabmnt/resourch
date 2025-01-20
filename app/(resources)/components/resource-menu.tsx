'use client'
import { DropdownDots } from '@/components/ui/dropdown-dots'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { addResourceToPinnedAction, deleteResourceAction } from '../actions'
import { Pin, Save, Share, Trash } from 'lucide-react'
import { Tables } from '@/database.types'
import { useRouter } from 'next/navigation'

export function ResourceMenu({
  resource,
  ownedByCurrentUser = false,
}: {
  resource: Tables<'resources'>
  ownedByCurrentUser?: boolean
}) {
  const router = useRouter()

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
      {ownedByCurrentUser && (
        <DropdownMenuItem
          className='flex items-center gap-2'
          onClick={() => {
            router.replace('?sharing=' + resource.id)
          }}
        >
          <Share
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
          Share
        </DropdownMenuItem>
      )}
      {!ownedByCurrentUser && (
        <DropdownMenuItem className='flex gap-2 items-center'>
          <Save
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
          Save
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
