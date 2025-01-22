import { TablesInsert } from '@/database.types'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '../auth/service'

export async function getUserResources(userId: string, query = '') {
  const supabase = await createClient()
  return await supabase
    .from('resources')
    .select('*, profile!resources_profile_id_fkey(*)')
    .eq('user_id', userId)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
}

export async function getFeaturedResources(query = '') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*, profile!resources_profile_id_fkey(*)')
    .eq('public', true)
    .ilike('title', `%${query}%`)
    .order('likes', { ascending: false })
    .order('total_clicks', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createResource(resource: TablesInsert<'resources'>) {
  const supabase = await createClient()
  return await supabase.from('resources').insert(resource).select().single()
}

export async function deleteResource(resourceId: string) {
  const supabase = await createClient()
  return await supabase.from('resources').delete().eq('id', resourceId)
}

export async function getPinnedResources(profileId: string) {
  const supabase = await createClient()
  return await supabase
    .from('pinned_resources')
    .select('*, profile(*), resources(*, profile!resources_profile_id_fkey(*), categories(*))')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true })
}

export async function unpinResource(resourceId: string) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { error: userError }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', userData.user.id)
    .single()
  if (profileError) {
    return { error: profileError }
  }

  const { error } = await supabase
    .from('pinned_resources')
    .delete()
    .eq('profile_id', profile.id)
    .eq('resource_id', resourceId)
  if (error) {
    return { error }
  }

  return { message: 'Resource unpinned' }
}

export async function unpinAllResources() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { error: userError }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', userData.user.id)
    .single()
  if (profileError) {
    return { error: profileError }
  }

  const { error } = await supabase.from('pinned_resources').delete().eq('profile_id', profile.id)

  if (error) {
    return { error }
  }

  return { message: 'All resources unpinned' }
}

export async function updateResource(resource: TablesInsert<'resources'>) {
  const supabase = await createClient()
  return await supabase.from('resources').upsert(resource).single()
}

export async function addCategoriesToResource(resourceId: string, categoriesIds: string[]) {
  const supabase = await createClient()
  return await supabase
    .from('resource_categories')
    .insert(categoriesIds.map((categoryId) => ({ resource_id: resourceId, category_id: categoryId })))
    .select()
}
