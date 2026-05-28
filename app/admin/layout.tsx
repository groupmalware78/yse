import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import '../globals.css'

export const metadata: Metadata = {
  title: 'YardStyle CMS',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#060606]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <main className="p-6 md:p-8 lg:p-10 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
