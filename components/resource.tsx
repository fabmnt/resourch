import { Tables } from '@/database.types'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Heart, Trash } from 'lucide-react'
import { Button } from './ui/button'
import { CardRevealedPointer } from './ui/card-revealed-pointer'
import { DropdownDots } from './ui/dropdown-dots'
import { DropdownMenuItem } from './ui/dropdown-menu'
import { deleteResourceAction } from '@/app/resources/actions'
import { ResourceMenu } from '@/app/resources/components/resource-menu'

export type ResourceSize = 'small' | 'medium' | 'large'
interface ResourceProps {
  resource: Tables<'resources'>
  size?: ResourceSize
}
export function Resource({ resource, size = 'medium' }: ResourceProps) {
  return (
    <CardRevealedPointer className={cn(size === 'medium' && 'max-w-[400px]', size === 'small' && 'max-w-fit')}>
      <article
        className={cn(
          'relative flex flex-col gap-1 rounded-sm border border-white/10',
          size === 'large' && 'px-3 py-4',
          size === 'medium' && 'p-3',
          size === 'small' && 'px-2 py-1.5',
        )}
      >
        <header className='flex justify-between items-center'>
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
        </header>
        <p className={cn('text-sm text-neutral-300', size === 'small' && 'hidden')}>{resource.description}</p>
      </article>
    </CardRevealedPointer>
  )
}
