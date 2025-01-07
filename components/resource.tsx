import { Tables } from '@/database.types'
import { CardRevealedPointer } from './ui/card-revealed-pointer'
import { ArrowUpRight, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

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
          'relative flex flex-col gap-2 rounded-sm border border-white/10',
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
              {resource.icon_url && <img src={resource.icon_url} />}
              <h6 className='font-medium tracking-wide'>{resource.title}</h6>
            </div>
            <div>
              <ArrowUpRight size={16} />
            </div>
          </a>
          <div>
            <Button
              variant='ghost'
              size='sm'
            >
              <Heart size={16} />
            </Button>
          </div>
        </header>
        <p className={cn('text-sm text-neutral-300', size === 'small' && 'hidden')}>{resource.description}</p>
      </article>
    </CardRevealedPointer>
  )
}
