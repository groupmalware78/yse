import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getSession } from '@/lib/actions/auth'

export const metadata: Metadata = {
  title: 'YardStyle CMS',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const admin = session ? { name: session.name, role: session.role } : null

  return (
    <div className="flex min-h-screen bg-[#060606]">
      <AdminSidebar admin={admin} />
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <main className="p-6 md:p-8 lg:p-10 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
