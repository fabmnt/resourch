'use client'
import { ResourceMenu } from '@/app/resources/components/resource-menu'
import { Tables } from '@/database.types'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Heart } from 'lucide-react'
import { Button } from './ui/button'
import { CardRevealedPointer } from './ui/card-revealed-pointer'
import { useState } from 'react'

export type ResourceSize = 'small' | 'medium' | 'large'
interface ResourceProps {
  resource: Tables<'resources'>
  size?: ResourceSize
}
export function Resource({ resource, size = 'medium' }: ResourceProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <CardRevealedPointer className={cn(size === 'medium' && 'max-w-[400px]', size === 'small' && 'max-w-fit')}>
      <article
        className={cn(
          'relative flex flex-col gap-2 rounded-sm border border-white/10',
          size === 'large' && 'px-3 py-1.5',
          size === 'medium' && 'p-2.5',
          size === 'small' && 'px-2 py-1.5',
        )}
      >
        <header className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <a
              className='flex gap-2 w-fit items-center hover:underline'
              href={resource.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='flex gap-2 items-center'>
                {resource.icon_url && (
                  <img
                    src={resource.icon_url}
                    alt={resource.title + 'logo'}
                    width={24}
                    height={24}
                    className='aspect-square'
                  />
                )}
                <h6 className='font-medium tracking-wide'>{resource.title}</h6>
              </div>
              <div>
                <ArrowUpRight size={16} />
              </div>
            </a>
            <div className='flex gap-2 items-center'>
              <Button
                variant='ghost'
                size='sm'
              >
                <Heart size={16} />
              </Button>
              <ResourceMenu resource={resource} />
            </div>
          </div>
          <div>
            <p className='text-xs text-neutral-500'>{new URL(resource.url).hostname.replace('www.', '')}</p>
          </div>
        </header>
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <p className={cn('text-sm text-neutral-300', size === 'small' && 'hidden', !isHovering && 'truncate')}>
            {resource.description}
          </p>
        </div>
      </article>
    </CardRevealedPointer>
  )
}
