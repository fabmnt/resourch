'use server'
import { Tables, TablesInsert } from '@/database.types'
import { getUser } from '../auth/service'
import { resourceSchema } from './schema'
import {
  pinResource,
  createResource,
  deleteResource,
  unpinAllResources,
  unpinResource,
  updateResource,
  addCategoriesToResource,
} from './service'
import { revalidatePath } from 'next/cache'
import { getUrlMetadata } from '../metadata/get-url-metadata'

export async function createResourceAction(prevState: any, formData: FormData) {
  let formDataUrl = formData.get('resource-url')?.toString().trim()
  if (!formDataUrl?.startsWith('https://') && !formDataUrl?.startsWith('http://')) {
    formDataUrl = 'https://' + formDataUrl
  }

  const rawFormData = {
    url: formDataUrl,
    title: formData.get('resource-title')?.toString().trim(),
    description: formData.get('resource-description')?.toString().trim(),
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

  const newResource: TablesInsert<'resources'> = {
    ...validatedResource.data,
    user_id: user.user.id,
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

  if (URLMetadata.iconURL != null) {
    if (!URLMetadata.iconURL.startsWith('https://')) {
      const origin = new URL(url).origin
      const iconURL = URLMetadata.iconURL?.startsWith('/') ? URLMetadata.iconURL : '/' + URLMetadata.iconURL
      newResource['icon_url'] = new URL(origin + iconURL).toString()
    } else {
      newResource['icon_url'] = URLMetadata.iconURL
    }
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
    await addCategoriesToResource(
      data.id,
      categoriesIds.map((id) => parseInt(id)),
    )
  }

  revalidatePath('/')

  return { message: 'success' }
}

export async function deleteResourceAction(resourceId: number) {
  const { error } = await deleteResource(resourceId)
  if (error) {
    return { error: error.message }
  }
  revalidatePath('/')
  return { message: 'success' }
}

export async function addResourceToPinnedAction(resourceId: number) {
  const { error } = await pinResource(resourceId)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { message: 'success' }
}

export async function unpinResourceAction(resourceId: number) {
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

export async function addClickToResourceAction(resource: TablesInsert<'resources'>) {
  resource.total_clicks = (resource.total_clicks ?? 0) + 1
  const { error } = await updateResource(resource)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { message: 'success' }
}

export async function saveSharedResourceAction(resource: TablesInsert<'resources'>, categoriesIds: number[]) {
  const { data, error: userError } = await getUser()
  if (userError) {
    return { error: userError.message }
  }

  const { user } = data
  const newResource: TablesInsert<'resources'> = {
    ...resource,
    user_id: user.id,
  }

  const { data: createdResource, error } = await createResource(newResource)
  if (error) {
    return { error: error.message }
  }

  if (categoriesIds.length > 0) {
    await addCategoriesToResource(createdResource.id, categoriesIds)
  }

  revalidatePath('/')

  return { message: 'success' }
}
