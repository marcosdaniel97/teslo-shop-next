import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  // con esta forma de validar rutas los usuarios no van a poder ir a nuestras pag protegidas
  if (!session?.user) {
    //redirect('/auth/login?returnTo=/perfil')
    redirect('/');
  }

  return (
    <div>
      <Title title="Perfil" />
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
      <h3>{session.user.role}</h3>
    </div>
  );
}
