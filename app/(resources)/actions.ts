'use server'
import { Tables, TablesInsert } from '@/database.types'
import { getUser } from '../auth/service'
import { resourceSchema } from './schema'
import { createResource, deleteResource, unpinAllResources, unpinResource, addCategoriesToResource } from './service'
import { revalidatePath } from 'next/cache'
import { getUrlMetadata } from '../metadata/get-url-metadata'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createResourceAction(prevState: any, formData: FormData) {
  let formDataUrl = formData.get('resource-url')?.toString().trim()
  if (!formDataUrl?.startsWith('https://') && !formDataUrl?.startsWith('http://')) {
    formDataUrl = 'https://' + formDataUrl
  }

  const rawFormData = {
    url: formDataUrl,
    title: formData.get('resource-title')?.toString().trim(),
    description: formData.get('resource-description')?.toString().trim(),
    public: formData.get('resource-public') === 'on',
  }

  const validatedResource = resourceSchema.safeParse(rawFormData)
  if (!validatedResource.success) {
    return {
      error: validatedResource.error.message,
    }
  }

  const { data: user, error: userError } = await getUser()
  if (userError) {
    return { error: userError.message }
  }

  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', user.user.id)
    .single()
  if (profileError) {
    return { error: profileError.message }
  }

  const {
    data: { url },
  } = validatedResource

  let URLMetadata
  try {
    URLMetadata = await getUrlMetadata(url)
  } catch (error) {
    return { error: 'Error getting URL metadata' }
  }

  const newResource: TablesInsert<'resources'> = {
    ...validatedResource.data,
    user_id: user.user.id,
    profile_id: profile.id,
    icon_url: URLMetadata.iconURL ?? '',
  }

  if (!newResource.description && URLMetadata.description) {
    newResource.description = URLMetadata.description
  }

  if (!newResource.title && URLMetadata.title) {
    newResource.title = URLMetadata.title
  }

  const { error, data } = await createResource(newResource)
  if (error) {
    return { error: error.message }
  }

  const categoriesIds = formData.get('categories')?.toString().split(',') ?? []

  if (categoriesIds.length > 0) {
    await addCategoriesToResource(data.id, categoriesIds)
  }

  revalidatePath('/')

  return { message: 'success' }
}

export async function deleteResourceAction(resourceId: string) {
  const { error } = await deleteResource(resourceId)
  if (error) {
    return { error: error.message }
  }
  revalidatePath('/')
  return { message: 'success' }
}

export async function addResourceToPinnedAction(resourceId: string) {
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

  const { error } = await supabase.from('pinned_resources').insert({ resource_id: resourceId, profile_id: profile.id })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
}

export async function unpinResourceAction(resourceId: string) {
  const { error } = await unpinResource(resourceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { message: 'success' }
}

export async function unpinAllResourcesAction() {
  const { error } = await unpinAllResources()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { message: 'success' }
}

export async function addClickToResourceAction(resourceId: string) {
  const supabase = await createClient()
  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('total_clicks')
    .eq('id', resourceId)
    .single()

  if (resourceError) {
    return { error: resourceError.message }
  }

  const { error } = await supabase
    .from('resources')
    .update({ total_clicks: resource.total_clicks + 1 })
    .eq('id', resourceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { message: 'success' }
}

export async function saveSharedResourceAction(resourceId: string) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return { error: userError.message }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', user.user.id)
    .single()
  if (profileError) {
    return { error: profileError.message }
  }

  const { error } = await supabase.from('saved_resources').insert({ resource_id: resourceId, profile_id: profile.id })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')

  return { message: 'success' }
}

export async function likeResource(resourceId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user == null) {
    redirect('/sign-in')
  }

  const { data: profile, error: profileError } = await supabase.from('profile').select().eq('user_id', user.id).single()
  if (profileError) {
    return { error: profileError.message }
  }

  const { error: likedResourceError, data } = await supabase
    .from('liked_resources')
    .insert({ resource_id: resourceId, profile_id: profile.id })
    .select('*, resources(*)')
    .single()

  if (likedResourceError) {
    return { error: likedResourceError.message }
  }

  const { error } = await supabase
    .from('resources')
    .update({ likes: data.resources.likes + 1 })
    .eq('id', resourceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
}

export async function unlikeResource(resourceId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user == null) {
    redirect('/sign-in')
  }

  const { data: profile, error: profileError } = await supabase.from('profile').select().eq('user_id', user.id).single()

  if (profileError) {
    return { error: profileError.message }
  }

  const { error: likedResourceError, data } = await supabase
    .from('liked_resources')
    .delete()
    .eq('resource_id', resourceId)
    .eq('profile_id', profile.id)
    .select('*, resources(*)')
    .single()

  if (likedResourceError) {
    return { error: likedResourceError.message }
  }

  const { error } = await supabase
    .from('resources')
    .update({ likes: data.resources.likes - 1 })
    .eq('id', resourceId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
}

export async function saveResourceAction(resourceId: string) {
  const supabase = await createClient()
  const { data: user, error: userError } = await getUser()
  if (userError) {
    return { error: userError.message }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', user.user.id)
    .single()
  if (profileError) {
    return { error: profileError.message }
  }

  const { error } = await supabase.from('saved_resources').insert({ resource_id: resourceId, profile_id: profile.id })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
}

export async function removeSavedResourceAction(resourceId: string) {
  const supabase = await createClient()
  const { data: user, error: userError } = await getUser()
  if (userError) {
    return { error: userError.message }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', user.user.id)
    .single()
  if (profileError) {
    return { error: profileError.message }
  }

  const { error } = await supabase
    .from('saved_resources')
    .delete()
    .eq('resource_id', resourceId)
    .eq('profile_id', profile.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
}
