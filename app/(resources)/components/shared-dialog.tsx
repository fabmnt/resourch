'use client'
import { Resource } from '@/components/resource'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tables, TablesInsert } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { saveSharedResourceAction } from '../actions'

export function SharedDialog() {
  const [sharedParam, setSharedParam] = useQueryState('shared')
  const [isOpen, setIsOpen] = useState(() => sharedParam != null)
  const [resource, setResource] = useState<Tables<'resources'> | undefined>()

  useEffect(() => {
    if (sharedParam == null) {
      return
    }
    const supabase = createClient()
    supabase
      .from('resources')
      .select('*')
      .eq('id', sharedParam)
      .single()
      .then(({ data }) => {
        if (data == null) {
          return
        }
        setIsOpen(true)
        setResource(data)
      })
  }, [sharedParam])

  useEffect(() => {
    if (!isOpen) {
      alert('closed')
      setResource(undefined)
      setSharedParam(null)
    }
  }, [isOpen])

  const handleSaveSharedResource = async () => {
    if (resource == null) {
      return
    }

    const newResource: TablesInsert<'resources'> = {
      ...resource,
      id: undefined,
      created_at: undefined,
      is_pinned: false,
    }
    saveSharedResourceAction(newResource).finally(() => {
      setIsOpen(false)
      setSharedParam(null)
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <div className='mb-2 flex flex-col items-center gap-2'>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>You have recieved a resource</DialogTitle>
            <DialogDescription className='sm:text-center'>Saved to your account or ignore it.</DialogDescription>
          </DialogHeader>
        </div>

        <div className='w-full'>
          {resource && (
            <Resource
              size='large'
              resource={resource}
              readonly
            />
          )}
        </div>
        <Button
          onClick={handleSaveSharedResource}
          type='button'
          className='w-full mt-4'
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  )
}