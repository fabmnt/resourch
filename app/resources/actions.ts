'use server'
import { TablesInsert } from '@/database.types'
import { getUser } from '../auth/service'
import { resourceSchema } from './schema'
import { createResource, deleteResource } from './service'
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
      error: 'Invalid data',
    }
  }
  validatedResource.data.url = new URL(validatedResource.data.url).origin
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

  if (URLMetadata.iconURL?.startsWith('/')) {
    newResource['icon_url'] = new URL(url + URLMetadata.iconURL).toString()
  } else {
    newResource['icon_url'] = URLMetadata.iconURL
  }

  if (!newResource.description && URLMetadata.description) {
    newResource.description = URLMetadata.description
  }

  if (!newResource.title && URLMetadata.title) {
    newResource.title = URLMetadata.title
  }

  const { error } = await createResource(newResource)
  if (error) {
    return { error: error.message }
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
