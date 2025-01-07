'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clipboard } from 'lucide-react'
import { createResourceAction } from '../actions'
import { useActionState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export function CreateResourceForm() {
  const [state, formAction, pending] = useActionState(createResourceAction, { message: '' })

  return (
    <form
      className='space-y-5'
      action={formAction}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='resource-url'>URL</Label>
          <div className='flex rounded-lg shadow-sm shadow-black/5'>
            <Input
              id='resource-url'
              name='resource-url'
              className='-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10'
              placeholder='https://www...'
              type='text'
            />
            <button
              className='inline-flex w-9 items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 outline-offset-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Paste URL'
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
            name='resource-title'
            placeholder='Rosource title'
            type='text'
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='resource-description'>Description (optional)</Label>
          <Input
            id='resource-description'
            name='resource-description'
            placeholder='A beautiful content that I has to remember...'
            type='text'
          />
        </div>
      </div>
      <Button
        type='submit'
        className='w-full'
      >
        {pending ? (
          <div className='flex gap-2 items-center'>
            Creating <Spinner />
          </div>
        ) : (
          'Create resource'
        )}
      </Button>
    </form>
  )
}
