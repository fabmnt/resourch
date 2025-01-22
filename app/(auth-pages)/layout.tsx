export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container max-w-4xl mx-auto py-6 flex flex-col items-center justify-center min-h-dvh'>
      {children}
    </div>
  )
}
