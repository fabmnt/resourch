import { ResourcesSkeleton } from '@/components/resource-skeleton'
import { Suspense } from 'react'
import { RecentResources } from '../components/resources-list'
import { type SearchParams } from 'nuqs/server'
import { loadSearchParams } from '@/lib/search-params'

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await loadSearchParams(searchParams)

  return (
    <Suspense
      key={q}
      fallback={<ResourcesSkeleton count={5} />}
    >
      <RecentResources q={q} />
    </Suspense>
  )
}
