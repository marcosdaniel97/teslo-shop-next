// archivo de definición de typeScript
// TypeScript lo usa automáticamente cuando usas funciones de Auth.js que devuelven una sesión.
// ejemplo: useSession: Session | null, auth(), getServerSession()
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  //la sesión de next-auth ahora tiene esta estructura
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified?: boolean;
      role: string;
      image?: string;
    } & DefaultSession['user']; // combina mi tipo con el tipo default de NextAuth, que tiene solamente name, email y image
  }
}
