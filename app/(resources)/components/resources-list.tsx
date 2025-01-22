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

  const { data: featuredResources, error } = await getFeaturedResources(q)
  const { data: likedResources } = await supabase
    .from('liked_resources')
    .select('*, profile(*)')
    .eq('profile.user_id', user.id)

  const likedResourceIds = likedResources?.map((resource) => resource.resource_id)

  const { data: savedResources } = await supabase
    .from('saved_resources')
    .select('*, profile(*)')
    .eq('profile.user_id', user.id)

  const savedResourceIds = savedResources?.map((resource) => resource.resource_id)

  const { data: pinnedResources } = await supabase.from('pinned_resources').select().eq('profile.user_id', user.id)
  const pinnedResourceIds = pinnedResources?.map((resource) => resource.resource_id)
  return (
    <div className='flex flex-col gap-4'>
      {featuredResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
          ownedByCurrentUser={resource.profile.user_id === user.id}
          isLiked={likedResourceIds?.includes(resource.id)}
          isSaved={savedResourceIds?.includes(resource.id)}
          isPinned={pinnedResourceIds?.includes(resource.id)}
        />
      ))}
    </div>
  )
}

export async function RecentResources({ q }: { q: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: userResources, error } = await getUserResources(user.id, q)
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
          ownedByCurrentUser
          isLiked={likedResourceIds?.includes(resource.id)}
        />
      ))}
    </div>
  )
}

export async function SavedResources({ q }: { q: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user == null) {
    redirect('/sign-in')
  }

  const { data: profile } = await supabase.from('profile').select('*').eq('user_id', user.id).single()
  if (profile == null) {
    redirect('/sign-in')
  }

  const { data: likedResources } = await supabase
    .from('liked_resources')
    .select('*, profile(*)')
    .eq('profile.user_id', user.id)

  const likedResourceIds = likedResources?.map((resource) => resource.resource_id)

  const { data } = await supabase
    .from('saved_resources')
    .select('*, resources(*, profile!resources_profile_id_fkey(*))')
    .eq('profile_id', profile.id)
  const savedResources = data?.map((row) => row.resources)
  const savedResourceIds = data?.map((row) => row.resource_id)

  return (
    <div className='flex flex-col gap-4'>
      {savedResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
          isLiked={likedResourceIds?.includes(resource.id)}
          isSaved={savedResourceIds?.includes(resource.id)}
        />
      ))}
    </div>
  )
}
