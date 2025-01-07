import { ResourcesSkeleton } from '@/components/resource-skeleton'
import { Suspense } from 'react'
import { FeaturedResources } from './components/resources-list'

export default async function Page() {
  return (
    <Suspense fallback={<ResourcesSkeleton count={5} />}>
      <FeaturedResources />
    </Suspense>
  )
}
