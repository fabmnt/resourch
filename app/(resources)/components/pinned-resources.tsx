import { getUser } from '@/app/auth/service'
import { Resource } from '@/components/resource'
import { Pin } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getPinnedResources } from '../service'
import { PinnedResourcesMenu } from './pinned-resrouces-menu'
import { createClient } from '@/utils/supabase/server'

export async function PinnedResources() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user == null) {
    return redirect('/sign-in')
  }

  const { data: profile, error: profileError } = await supabase.from('profile').select().eq('user_id', user.id).single()
  if (profileError) {
    return redirect('/sign-in')
  }

  const { data, error } = await getPinnedResources(profile.id)
  const pinnedResources = data?.map((pinnedResource) => pinnedResource.resources).flat()

  if (pinnedResources == null || pinnedResources.length === 0) {
    return null
  }

  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <span>
          <Pin
            size={16}
            strokeWidth={1}
          />
        </span>
        <div>
          <PinnedResourcesMenu resources={pinnedResources} />
        </div>
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2'>
        {pinnedResources.map((resource) => (
          <Resource
            key={resource.id}
            resource={resource}
            size='small'
          />
        ))}
      </div>
    </div>
  )
}
