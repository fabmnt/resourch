import { TablesInsert } from '@/database.types'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '../auth/service'

export async function getCurrentUserResources() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await getUser()
  if (userError) {
    return { data: null, error: userError }
  }

  const { data, error } = await supabase.from('resources').select('*').eq('user_id', userData.user.id)

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
