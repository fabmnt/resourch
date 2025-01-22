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
      {userResources?.length === 0 && (
        <div className='text-center text-neutral-400'>No resources found, create your first resource.</div>
      )}
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

  const { data: savedResources } = await supabase
    .from('resources')
    .select(
      `
    *,
    saved_resources!inner(*, profile(*)),
    profile!resources_profile_id_fkey(*)
  `,
    )
    .eq('saved_resources.profile_id', profile.id)
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })
  const savedResourceIds = savedResources?.map((row) => row.id)

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
      {savedResources?.length === 0 && <div className='text-center text-neutral-400'>No resources were saved yet.</div>}
    </div>
  )
}
