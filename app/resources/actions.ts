'use server'
import { TablesInsert } from '@/database.types'
import { getUser } from '../auth/service'
import { resourceSchema } from './schema'
import { createResource, deleteResource } from './service'
import { revalidatePath } from 'next/cache'
import { getUrlMetadata } from '../metadata/get-url-metadata'

export async function createResourceAction(prevState: any, formData: FormData) {
  const rawFormData = {
    url: formData.get('resource-url')?.toString(),
    title: formData.get('resource-title')?.toString(),
    description: formData.get('description')?.toString(),
  }

  const validatedResource = resourceSchema.safeParse(rawFormData)
  if (!validatedResource.success) {
    return {
      error: 'Invalid data',
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

  const URLMetadata = await getUrlMetadata(newResource.url)
  console.log('URLMetadata', URLMetadata)
  newResource['icon_url'] = URLMetadata.iconURL
  if (newResource.description == null) {
    newResource.description = URLMetadata.description
  }

  const { error } = await createResource(newResource)
  if (error) {
    return { error: error.message }
  }
  revalidatePath('/')

  return { message: 'Resource created successfully' }
}

export async function deleteResourceAction(resourceId: number) {
  const { error } = await deleteResource(resourceId)
  if (error) {
    return { error: error.message }
  }
  revalidatePath('/')
  return { message: 'Resource deleted successfully' }
}
