import { CardRevealedPointer } from './card-revealed-pointer'

export function ResourceSkeleton() {
  return (
    <CardRevealedPointer>
      <div className='p-4 space-y-4'>
        <div className='h-6 animate-pulse bg-neutral-800 rounded-sm' />
        <div className='h-6 animate-pulse bg-neutral-800 rounded-sm' />
      </div>
    </CardRevealedPointer>
  )
}

export function ResourcesSkeleton({ count = 3 }) {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: count }).map((_, index) => (
        <ResourceSkeleton key={index} />
      ))}
    </div>
  )
}
