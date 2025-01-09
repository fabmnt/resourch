import { Resource } from '@/components/resource'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getFeaturedResources, getUserResources } from '../service'

export async function FeaturedResources({ q }: { q: string }) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: userResources } = await getFeaturedResources(user.id, q)

  return (
    <div className='flex flex-col gap-4'>
      {userResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
        />
      ))}
    </div>
  )
}

export async function RecentResources({ q }: { q: string }) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: userResources } = await getUserResources(user.id, q)

  return (
    <div className='flex flex-col gap-4'>
      {userResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
        />
      ))}
    </div>
  )
}
