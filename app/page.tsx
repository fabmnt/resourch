import { CreateResource } from '@/components/create-resource'
import { Resource } from '@/components/resource'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const client = await createClient()
  const { data, error } = await client.from('resources').select('*')

  if (error) {
    return <div>Error loading resources</div>
  }

  const resource = data[0]
  if (resource === undefined) {
    return <div>No resources found</div>
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
      <div>
        <Resource
          resource={resource}
          size='large'
        />
      </div>
    </div>
  )
}
