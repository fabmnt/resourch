import { ResourcesSkeleton } from '@/components/resource-skeleton'
import { loadSearchParams } from '@/lib/search-params'
import { SearchParams } from 'nuqs'
import { Suspense } from 'react'
import { SavedResources } from '../components/resources-list'

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
      <SavedResources q={q} />
    </Suspense>
  )
}
