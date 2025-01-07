'use client'
import { ResourceMenu } from '@/app/(resources)/components/resource-menu'
import { Tables } from '@/database.types'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { CardRevealedPointer } from './card-revealed-pointer'
import { addClickToResourceAction } from '@/app/(resources)/actions'

export type ResourceSize = 'small' | 'medium' | 'large'
interface ResourceProps {
  resource: Tables<'resources'>
  size?: ResourceSize
}
export function Resource({ resource, size = 'medium' }: ResourceProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <CardRevealedPointer className={cn(size === 'medium' && 'max-w-[400px]')}>
      <article
        className={cn(
          'relative flex flex-col rounded-sm border border-white/10 h-full',
          size === 'large' && 'px-3 py-1.5',
          size === 'medium' && 'p-2.5',
          size === 'small' && 'p-2',
        )}
      >
        <header className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <a
              onClick={() => addClickToResourceAction(resource)}
              className={cn('flex gap-2 w-fit items-center hover:underline')}
              href={resource.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='flex gap-2 items-center'>
                {resource.icon_url && (
                  <img
                    src={resource.icon_url}
                    alt={resource.title + 'logo'}
                    width='24'
                    height='24'
                    className='aspect-square size-6'
                  />
                )}
                <h6 className={cn('font-medium tracking-wide', size === 'small' && 'max-w-[10ch] text-sm truncate')}>
                  {resource.title}
                </h6>
              </div>
              <div className={cn(size === 'small' && 'hidden')}>
                <ArrowUpRight size={16} />
              </div>
            </a>
            <div className={cn('flex gap-2 items-center', size === 'small' && 'hidden')}>
              <ResourceMenu resource={resource} />
            </div>
          </div>
          <div>
            <p className={cn('text-xs text-neutral-500', size === 'small' && 'max-w-[10ch] text-sm truncate')}>
              {new URL(resource.url).toString().replace('https://', '').replace('www.', '')}
            </p>
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
