import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {adminCookie, verifyAdminSession} from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({children}:{children:React.ReactNode}) {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(adminCookie.name)?.value);
  if (!session) redirect('/admin/login');
  return children;
}
