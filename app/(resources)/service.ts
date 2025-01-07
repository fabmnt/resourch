import { TablesInsert } from '@/database.types'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '../auth/service'

export async function getUserResources(userId: string, q = '') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getFeaturedResources(userId: string, query = '') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', `%${query}%`)
    .order('total_clicks', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createResource(resource: TablesInsert<'resources'>) {
  const supabase = await createClient()
  return await supabase.from('resources').insert(resource)
}

export async function deleteResource(resourceId: number) {
  const supabase = await createClient()
  return await supabase.from('resources').delete().eq('id', resourceId)
}

export async function addResourceToPinned(resourceId: number) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { data: null, error: userError }
  }

  const { data, error } = await supabase
    .from('pinned_resources')
    .insert({
      user_id: userData.user.id,
      resource_id: resourceId,
    })
    .select()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getPinnedResources(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('pinned_resources').select('resources(*)').eq('user_id', userId)

  if (error) {
    return { data: null, error }
  }
  const resources = data.map((pinnedResource) => pinnedResource.resources)
  return { data: resources, error: null }
}

export async function unpinResource(resourceId: number) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { error: userError }
  }

  const { error } = await supabase
    .from('pinned_resources')
    .delete()
    .eq('user_id', userData.user.id)
    .eq('resource_id', resourceId)

  if (error) {
    return { error }
  }

  return { error: null }
}

export async function unpinAllResources() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { error: userError }
  }

  const { error } = await supabase.from('pinned_resources').delete().eq('user_id', userData.user.id)

  if (error) {
    return { error }
  }

  return { error: null }
}

export async function updateResource(resource: TablesInsert<'resources'>) {
  const supabase = await createClient()
  return await supabase.from('resources').upsert(resource).single()
}
