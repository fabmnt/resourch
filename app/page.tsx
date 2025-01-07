import { getFeaturedResources, getPinnedResources } from '@/app/resources/service'
import { CreateResourceDialog } from '@/components/create-resource-dialog'
import { MainNav } from '@/components/main-nav'
import { Resource } from '@/components/resource'
import { SearchResource } from '@/components/ui/search'
import { redirect } from 'next/navigation'
import { getUser } from './auth/service'
import { PinnedResources } from './resources/components/pinned-resources'

export default async function Home() {
  const {
    data: { user },
  } = await getUser()
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: userResources, error: resourcesError } = await getFeaturedResources(user.id)
  if (resourcesError) {
    return <div>Error loading resources</div>
  }

  const { data: pinnedResources, error } = await getPinnedResources(user.id)
  if (error) {
    return <div>Error loading pinned resources</div>
  }

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
          <PinnedResources resources={pinnedResources} />
        </section>
      </div>
      <div className='container'>
        <MainNav />
      </div>
      <div className='container flex flex-col gap-4'>
        {userResources.map((resource) => (
          <Resource
            key={resource.id}
            resource={resource}
            size='large'
          />
        ))}
      </div>
    </div>
  )
}
