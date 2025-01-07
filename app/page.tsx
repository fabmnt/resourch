import { CreateResource } from '@/components/create-resource'
import { Resource } from '@/components/resource'
import { getCurrentUserResources } from '@/app/resources/service'
import { getUser } from './auth/service'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { data } = await getUser()
  if (data == null) {
    return redirect('/login')
  }

  const { data: userResources, error } = await getCurrentUserResources()

  if (error) {
    return <div>Error loading resources</div>
  }

  return (
    <div className='container flex flex-col gap-y-4 md:gap-y-6 mx-auto max-w-4xl py-4 md:py-6'>
      <header className='flex justify-between items-center'>
        <div>
          <h1 className='font-semibold tracking-wide'>Resourch</h1>
          <p className='text-neutral-300'>A site where you can save your links and resources.</p>
        </div>
        <div>
          <CreateResource />
        </div>
      </header>
      <div className='flex flex-col gap-4'>
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
