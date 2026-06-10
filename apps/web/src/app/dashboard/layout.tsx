import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const navUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }

  return (
    <div className="flex min-h-screen bg-fortress-midnight">
      <Sidebar user={navUser} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav user={navUser} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
