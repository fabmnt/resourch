import { CreateResourceDialog } from '@/components/create-resource-dialog'
import { MainNav } from '@/components/main-nav'
import { ResourcesSkeleton } from '@/components/resource-skeleton'
import { SearchResource } from '@/app/(resources)/components/search-resources'
import { ReactNode, Suspense } from 'react'
import { PinnedResources } from './components/pinned-resources'

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='flex flex-col mx-auto max-w-4xl'>
      <div className='flex flex-col gap-y-4 sticky top-0 z-50 py-4 md:py-6 bg-background'>
        <header className='container flex justify-between items-center'>
          <div>
            <h1 className='font-semibold tracking-wide'>Resourch</h1>
            <p className='text-neutral-300'>A site where you can save your links and resources.</p>
          </div>
          <div>
            <CreateResourceDialog />
          </div>
        </header>
        <section className='container'>
          <Suspense fallback={<ResourcesSkeleton count={1} />}>
            <PinnedResources />
          </Suspense>
        </section>
        <div className='container'>
          <Suspense>
            <SearchResource />
          </Suspense>
        </div>
        <div className='container'>
          <MainNav />
        </div>
      </div>
      <div className='container'>{children}</div>
    </div>
  )
}
