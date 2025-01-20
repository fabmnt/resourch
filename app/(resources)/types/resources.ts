import { Tables } from '@/database.types'

export interface ResourceWithCategories extends Tables<'resources'> {
  categories?: Tables<'categories'>[]
  profile: Tables<'profile'>
}
