import { getUser } from '@/app/auth/service'
import { getUserResources } from '../service'
import { redirect } from 'next/navigation'
import { Resource } from '@/components/resource'

export default async function Page() {
  const { data } = await getUser()
  const { user } = data
  if (user == null) {
    return redirect('/sign-in')
  }
  const { data: userResources } = await getUserResources(user.id)

  return (
    <div className='flex flex-col gap-4'>
      {userResources?.map((resource) => (
        <Resource
          key={resource.id}
          resource={resource}
          size='large'
        />
      ))}
    </div>
  )
}
