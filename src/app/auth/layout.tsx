import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // si hay un usuario lleva al root de la app y no permite volver a /auth/login
  if (session?.user) {
    redirect('/');
  }
  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-[350px] px-10">{children}</div>
    </main>
  );
}
