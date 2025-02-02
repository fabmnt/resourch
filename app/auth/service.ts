import { createClient } from '@/utils/supabase/server'

export async function getUser() {
  const supabase = await createClient()
  return await supabase.auth.getUser()
}
