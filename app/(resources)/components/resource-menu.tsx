'use client'
import { DropdownDots } from '@/components/ui/dropdown-dots'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
  addResourceToPinnedAction,
  deleteResourceAction,
  removeSavedResourceAction,
  saveResourceAction,
} from '../actions'
import { Bookmark, BookmarkMinus, BookmarkX, Download, Pin, Save, Share, Trash } from 'lucide-react'
import { Tables } from '@/database.types'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function ResourceMenu({
  resource,
  ownedByCurrentUser = false,
  isSaved = false,
}: {
  resource: Tables<'resources'>
  ownedByCurrentUser?: boolean
  isSaved?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <DropdownDots>
      {!resource.is_pinned && ownedByCurrentUser && (
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
      {!ownedByCurrentUser && !isSaved && (
        <DropdownMenuItem
          onClick={async () => {
            await saveResourceAction(resource.id)
            toast({
              title: 'Resource saved successfully',
            })
          }}
          className='flex gap-2 items-center'
        >
          <Bookmark
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
          Save
        </DropdownMenuItem>
      )}
      {!ownedByCurrentUser && isSaved && (
        <DropdownMenuItem
          onClick={async () => {
            await removeSavedResourceAction(resource.id)
            toast({
              title: 'Resource removed successfully',
            })
          }}
          className='flex gap-2 items-center'
        >
          <BookmarkX
            size={16}
            strokeWidth={2}
            aria-hidden='true'
          />
          Remove
        </DropdownMenuItem>
      )}
      {ownedByCurrentUser && (
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
      )}
    </DropdownDots>
  )
}
