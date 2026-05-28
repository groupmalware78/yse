// Demo credentials — replace with real auth (NextAuth, Clerk, Supabase Auth, etc.)
const ADMIN_CREDENTIALS = [
  { username: 'admin', password: 'YardStyle2026!', role: 'superadmin', name: 'Admin' },
  { username: 'manager', password: 'YSEManager!', role: 'manager', name: 'Label Manager' },
]

export function login(username: string, password: string): { success: boolean; error?: string } {
  const user = ADMIN_CREDENTIALS.find(
    u => u.username === username && u.password === password
  )
  if (!user) return { success: false, error: 'Invalid username or password' }

  const token = btoa(`${user.role}:${user.name}:${Date.now()}`)
  document.cookie = `yse_admin=${token}; path=/; max-age=${8 * 60 * 60}; SameSite=Strict`
  return { success: true }
}

export function logout() {
  document.cookie = 'yse_admin=; path=/; max-age=0'
  window.location.href = '/admin/login'
}

export function getAdminInfo(): { role: string; name: string } | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/yse_admin=([^;]+)/)
  if (!match) return null
  try {
    const [role, name] = atob(match[1]).split(':')
    return { role, name }
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false
  const match = document.cookie.match(/yse_admin=([^;]+)/)
  if (!match) return false
  try {
    const [, , ts] = atob(match[1]).split(':')
    return Date.now() - parseInt(ts, 10) < 8 * 60 * 60 * 1000
  } catch {
    return false
  }
}
