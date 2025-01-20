import { Resource } from '@/components/resource'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getFeaturedResources, getUserResources } from '../service'

export async function FeaturedResources({ q }: { q: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: featuredResources } = await getFeaturedResources(q)

  const { data: likedResources } = await supabase
    .from('liked_resources')
    .select('*, profile(*)')
    .eq('profile.user_id', user.id)

  const likedResourceIds = likedResources?.map((resource) => resource.resource_id)

  return (
    <div className='flex flex-col gap-4'>
      {featuredResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
          isLiked={likedResourceIds?.includes(resource.id)}
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
  const { data: likedResources } = await supabase
    .from('liked_resources')
    .select('*, profile(*)')
    .eq('profile.user_id', user.id)

  const likedResourceIds = likedResources?.map((resource) => resource.resource_id)

  return (
    <div className='flex flex-col gap-4'>
      {userResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
          isLiked={likedResourceIds?.includes(resource.id)}
        />
      ))}
    </div>
  )
}
