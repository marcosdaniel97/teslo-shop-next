import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const user = session.user;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Title title="Perfil" />

      <div className="bg-white shadow-xl rounded-2xl p-6 mt-5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Nombre</span>
            <span className="font-medium">{user.name}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Rol</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
        </div>

        {/* Debug opcional */}
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-gray-400">
            Ver datos técnicos
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-3 rounded-md overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
