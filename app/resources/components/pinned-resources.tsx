'use client'
import { Resource } from '@/components/resource'
import { DropdownDots } from '@/components/ui/dropdown-dots'
import { DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Tables } from '@/database.types'
import { Minus, Pin } from 'lucide-react'
import { unpinResourceAction } from '../actions'

interface PinnedResourcesProps {
  resources: Tables<'resources'>[]
}

export function PinnedResources({ resources }: PinnedResourcesProps) {
  return (
    <div className='container'>
      <div className='mb-2 flex items-center justify-between'>
        <span>
          <Pin
            size={16}
            strokeWidth={1}
          />
        </span>
        <div>
          <DropdownDots>
            <DropdownMenuLabel>Unpin resources</DropdownMenuLabel>
            {resources.map((resource) => (
              <DropdownMenuItem
                onClick={() => unpinResourceAction(resource.id)}
                key={resource.id}
                className='flex text-xs items-center justify-between gap-2'
              >
                <div className='flex flex-col'>
                  <span className='truncate max-w-[20ch]'>{resource.title}</span>
                  <span className='text-neutral-400 truncate max-w-[20ch]'>{resource.url}</span>
                </div>
                <Minus
                  size={16}
                  className='text-destructive'
                />
              </DropdownMenuItem>
            ))}
          </DropdownDots>
        </div>
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2'>
        {resources.map((resource) => (
          <Resource
            key={resource.id}
            resource={resource}
            size='small'
          />
        ))}
      </div>
    </div>
  )
}
