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
  readonly?: boolean
}
export function Resource({ resource, size = 'medium', readonly = false }: ResourceProps) {
  const [isHovering, setIsHovering] = useState(false)
  let displayableURL = new URL(resource.url).toString().replace('https://', '').replace('www.', '')
  if (displayableURL.endsWith('/')) {
    displayableURL = displayableURL.slice(0, -1)
  }

  return (
    <CardRevealedPointer className={cn('w-full', size === 'medium' && 'max-w-[400px]')}>
      <article
        className={cn(
          'relative flex flex-col rounded-sm border border-white/10 h-full',
          size === 'large' && 'px-3 py-2',
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
                <h6
                  className={cn(
                    'font-medium tracking-wide max-w-[10ch] md:max-w-[30ch] truncate',
                    size === 'small' && 'text-sm md:max-w-[10ch]',
                  )}
                >
                  {resource.title}
                </h6>
              </div>
              <div className={cn(size === 'small' && 'hidden')}>
                <ArrowUpRight size={16} />
              </div>
            </a>
            {!readonly && (
              <div className={cn('flex gap-2 items-center', size === 'small' && 'hidden')}>
                <ResourceMenu resource={resource} />
              </div>
            )}
          </div>
          <div>
            <p className={cn('text-xs text-neutral-400', size === 'small' && 'max-w-[10ch] text-sm truncate')}>
              {displayableURL}
            </p>
          </div>
        </header>
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <p
            className={cn(
              'text-sm text-neutral-300 max-w-full whitespace-normal',
              size === 'small' && 'hidden',
              !isHovering && 'truncate',
            )}
          >
            {resource.description}
          </p>
        </div>
      </article>
    </CardRevealedPointer>
  )
}
