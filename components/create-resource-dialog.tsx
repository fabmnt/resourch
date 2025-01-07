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
import { useToast } from '@/hooks/use-toast'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function CreateResourceDialog() {
  const [isOpen, setOpen] = useState(false)
  const { toast } = useToast()

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
        <CreateResourceForm
          onSuccess={() => {
            setOpen(false)
            toast({
              title: 'Success',
              description: 'Resource created successfully',
            })
          }}
          onError={(error) => {
            toast({
              title: 'Error',
              description: error,
              variant: 'destructive',
            })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
