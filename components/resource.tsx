'use client'
import { addClickToResourceAction, likeResource, unlikeResource } from '@/app/(resources)/actions'
import { ResourceMenu } from '@/app/(resources)/components/resource-menu'
import { ResourceWithCategories } from '@/app/(resources)/types/resources'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import { startTransition, useOptimistic, useState } from 'react'
import { CardRevealedPointer } from './card-revealed-pointer'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export type ResourceSize = 'small' | 'medium' | 'large'
interface ResourceProps {
  resource: ResourceWithCategories
  size?: ResourceSize
  readonly?: boolean
  isLiked?: boolean
  ownedByCurrentUser?: boolean
  isSaved?: boolean
  isPinned?: boolean
}
export function Resource({
  resource,
  size = 'medium',
  readonly = false,
  isLiked = false,
  ownedByCurrentUser = false,
  isSaved = false,
  isPinned = false,
}: ResourceProps) {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic({ total_likes: resource.likes, liked: isLiked })
  const [isHovering, setIsHovering] = useState(false)
  let displayableURL = new URL(resource.url).toString().replace('https://', '').replace('www.', '')
  if (displayableURL.endsWith('/')) {
    displayableURL = displayableURL.slice(0, -1)
  }

  const handleLikeResource = async () => {
    startTransition(async () => {
      setOptimisticLikes((prev) => ({
        ...prev,
        isLiked: !prev.liked,
        likes: prev.liked ? prev.total_likes - 1 : prev.total_likes + 1,
      }))
      if (!optimisticLikes.liked) {
        await likeResource(resource.id)
      } else {
        await unlikeResource(resource.id)
      }
    })
  }

  return (
    <CardRevealedPointer className={cn('w-full', size === 'medium' && 'max-w-[400px]')}>
      <article
        className={cn(
          'relative flex flex-col rounded-sm border border-white/10 h-full gap-1',
          size === 'large' && 'px-3 py-2',
          size === 'medium' && 'p-2.5',
          size === 'small' && 'p-2',
        )}
      >
        <header className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <a
              onClick={() => addClickToResourceAction(resource.id)}
              className='w-fit hover:underline'
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
                <div
                  className={cn(
                    'flex flex-col max-w-[10ch] md:max-w-[40ch]',
                    size === 'small' && 'text-sm md:max-w-[8ch]',
                  )}
                >
                  <h6 className={cn('font-medium tracking-wide truncate')}>{resource.title}</h6>
                  <div>
                    <p
                      className={cn(
                        'text-xs text-neutral-400 truncate',
                        size === 'small' && 'max-w-[10ch] text-sm truncate',
                      )}
                    >
                      {displayableURL}
                    </p>
                  </div>
                </div>
              </div>
            </a>
            {!readonly && (
              <div className={cn('flex gap-2 items-center', size === 'small' && 'hidden')}>
                <ResourceMenu
                  ownedByCurrentUser={ownedByCurrentUser}
                  resource={resource}
                  isSaved={isSaved}
                  isPinned={isPinned}
                />
              </div>
            )}
          </div>
        </header>
        {size !== 'small' && (
          <div className='flex flex-wrap gap-1'>
            {resource.categories?.map((category) => (
              <Badge
                variant='outline'
                className='text-neutral-300'
                key={category.id}
              >
                {category.title}
              </Badge>
            ))}
          </div>
        )}
        {size !== 'small' && (
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <p className={cn('text-sm text-neutral-300 max-w-full whitespace-normal', !isHovering && 'truncate')}>
              {resource.description}
            </p>
          </div>
        )}
        {size !== 'small' && (
          <footer className='flex justify-between'>
            <p className='text-xs self-end text-neutral-400 font-semibold'>Publicado por {resource.profile?.name}</p>
            {!readonly && (
              <Button
                onClick={handleLikeResource}
                variant='ghost'
              >
                <div className='flex gap-x-2 items-center'>
                  <Heart
                    size={20}
                    fill={optimisticLikes.liked ? '#fff' : ''}
                  />
                  {optimisticLikes.total_likes}
                </div>
              </Button>
            )}
          </footer>
        )}
      </article>
    </CardRevealedPointer>
  )
}
