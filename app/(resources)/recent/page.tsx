import { ResourcesSkeleton } from '@/components/resource-skeleton'
import { Suspense } from 'react'
import { RecentResources } from '../components/resources-list'

export default function Page() {
  return (
    <Suspense fallback={<ResourcesSkeleton count={5} />}>
      <RecentResources />
    </Suspense>
  )
}
