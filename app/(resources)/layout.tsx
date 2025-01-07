import { CreateResourceDialog } from '@/components/create-resource-dialog'
import { SearchResource } from '@/components/ui/search'
import { ReactNode } from 'react'
import { PinnedResources } from './components/pinned-resources'
import { MainNav } from '@/components/main-nav'
import { getUser } from '../auth/service'
import { redirect } from 'next/navigation'
import { getPinnedResources } from './service'

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const {
    data: { user },
  } = await getUser()
  if (user == null) {
    return redirect('/sign-in')
  }
  const { data: pinnedResources } = await getPinnedResources(user.id)

  return (
    <div className='flex flex-col gap-y-4 md:gap-y-6 mx-auto max-w-4xl'>
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
        <div className='container'>
          <SearchResource />
        </div>
        <section>
          <PinnedResources resources={pinnedResources ?? []} />
        </section>
      </div>
      <div className='container'>
        <MainNav />
      </div>
      <div className='container flex flex-col gap-4'>{children}</div>
    </div>
  )
}
