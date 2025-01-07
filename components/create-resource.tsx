'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clipboard, Plus } from 'lucide-react'

export function CreateResource() {
  return (
    <Dialog>
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
        <form className='space-y-5'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='resource-url'>URL</Label>
              <div className='flex rounded-lg shadow-sm shadow-black/5'>
                <Input
                  id='resource-url'
                  className='-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10'
                  placeholder='https://www...'
                  type='text'
                />
                <button
                  className='inline-flex w-9 items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 outline-offset-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  aria-label='Subscribe'
                  type='button'
                >
                  <Clipboard
                    size={16}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='resource-title'>Title</Label>
              <Input
                id='resource-title'
                placeholder='Rosource title'
                type='text'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='resource-description'>Description (optional)</Label>
              <Input
                id='resource-description'
                placeholder='A beautiful content that I has to remember...'
                type='text'
                required
              />
            </div>
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Create resource
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
