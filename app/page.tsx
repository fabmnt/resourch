import { getCurrentUserResources } from '@/app/resources/service'
import { CreateResourceDialog } from '@/components/create-resource-dialog'
import { Resource } from '@/components/resource'
import { redirect } from 'next/navigation'
import { getUser } from './auth/service'
import { SearchResource } from '@/components/ui/search'

export default async function Home() {
  const { data: user } = await getUser()
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: userResources, error } = await getCurrentUserResources()

  if (error) {
    return <div>Error loading resources</div>
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
