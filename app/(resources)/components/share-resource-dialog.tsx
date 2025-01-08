'use client'
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
import { Tables } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { Copy } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

export function ShareResourceDialog() {
  const [sharingId, setSharingId] = useQueryState('sharing')
  const [shareLink, setShareLink] = useState<string | undefined>()
  const [isOpen, setIsOpen] = useState(() => sharingId != null)

  useEffect(() => {
    if (sharingId == null) {
      return
    }

    const supabase = createClient()
    supabase
      .from('resources')
      .select('*')
      .eq('id', sharingId)
      .single()
      .then(({ data }) => {
        if (data == null) {
          return
        }
        setIsOpen(true)
        const url = new URL(new URL(window.location.href).origin)
        url.searchParams.set('shared', sharingId.toString())
        setShareLink(url.toString())
      })
  }, [sharingId])

  useEffect(() => {
    if (!isOpen) {
      setSharingId(null)
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <div className='mb-2 flex flex-col items-center gap-2'>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>Share this resource</DialogTitle>
            <DialogDescription className='sm:text-center'>Copy the link and share it.</DialogDescription>
          </DialogHeader>
        </div>
        <div className='w-full'>
          <div className='space-y-2'>
            <Label htmlFor='invitation-link'>Resource invitation link.</Label>
            <div className='relative'>
              <Input
                defaultValue={shareLink}
                id='invitation-link'
                className='pe-9'
                placeholder='Email'
                readOnly
                type='email'
              />
              <button
                onClick={() => {
                  if (shareLink == null) {
                    return
                  }
                  navigator.clipboard.writeText(shareLink)
                }}
                className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                aria-label='Subscribe'
              >
                <Copy
                  size={16}
                  strokeWidth={2}
                  aria-hidden='true'
                />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
