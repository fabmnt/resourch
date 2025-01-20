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
import { useToast } from '@/hooks/use-toast'
import { ResourceWithCategories } from '../types/resources'

export function SharedDialog() {
  const [sharedParam, setSharedParam] = useQueryState('shared')
  const [isOpen, setIsOpen] = useState(() => sharedParam != null)
  const [resource, setResource] = useState<ResourceWithCategories | undefined>()
  const { toast } = useToast()

  useEffect(() => {
    if (sharedParam == null) {
      return
    }

    const supabase = createClient()
    supabase
      .from('resources')
      .select('*, categories(*), profile(*)')
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
      setResource(undefined)
      setSharedParam(null)
    }
  }, [isOpen])

  const handleSaveSharedResource = async () => {
    if (resource == null) {
      return
    }
    const categoriesIds = resource.categories?.map((category) => category.id) ?? []
    const newResource = {
      ...resource,
      categories: undefined,
      id: undefined,
      created_at: undefined,
    }
    saveSharedResourceAction(newResource, categoriesIds)
      .then(({ error }) => {
        if (error) {
          toast({
            title: 'Error',
            description: error,
          })
          return
        }

        toast({
          title: 'Success',
          description: 'Resource saved successfully',
        })
      })
      .finally(() => {
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
