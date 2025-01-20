import { TablesInsert } from '@/database.types'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '../auth/service'

export async function getUserResources(userId: string, query = '') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*, categories(*), profile(*)')
    .eq('user_id', userId)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getFeaturedResources(query = '') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*, categories(*), profile(*)')
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

export async function deleteResource(resourceId: number) {
  const supabase = await createClient()
  return await supabase.from('resources').delete().eq('id', resourceId)
}

export async function pinResource(resourceId: number) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { error: userError }
  }

  const { error } = await supabase
    .from('resources')
    .update({
      is_pinned: true,
      pinned_at: new Date().toISOString(),
    })
    .eq('id', resourceId)
    .eq('user_id', userData.user.id)

  if (error) {
    return { error }
  }

  return { error: null }
}

export async function getPinnedResources(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .eq('is_pinned', true)
    .order('pinned_at', { ascending: true })

  if (error) {
    return { data: null, error }
  }
  return { data, error: null }
}

export async function unpinResource(resourceId: number) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { error: userError }
  }

  const { error } = await supabase
    .from('resources')
    .update({
      is_pinned: false,
      pinned_at: null,
    })
    .eq('user_id', userData.user.id)
    .eq('id', resourceId)

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

  const { error } = await supabase
    .from('resources')
    .update({
      is_pinned: false,
      pinned_at: null,
    })
    .eq('user_id', userData.user.id)

  if (error) {
    return { error }
  }

  return { error: null }
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
