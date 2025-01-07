'use client'
import { CreateResourceForm } from '@/app/resources/components/create-resource-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function CreateResourceDialog() {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='flex-row gap-2 items-center'
        >
          Nuevo <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='sm:text-center'>New resource</DialogTitle>
          <DialogDescription className='sm:text-center'>Add a new resource to your collection</DialogDescription>
        </DialogHeader>
        <CreateResourceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
