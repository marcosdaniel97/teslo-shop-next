import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

//const authenticatedRoutes = ['checkout/address'];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      //console.log('Middleware');
      //console.log({ auth });
      /* const isLoggedIn = !!auth?.user;
      const isProtected = authenticatedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );
      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to loging page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      } */
      return true;
    },

    jwt({ token, user }) {
      //console.log({ token, user }); como user solo existe en el login y luego desaparece lo guardamos en el token
      // tambien en consola podemos ver que user tiene el rol asi que lo agregamos al token
      if (user) {
        token.data = user;
      }

      return token;
    },
    session({ session, token, user }) {
      //console.log({ session, token, user });
      // aqui podemos revalidar la informacion para ver si se bloqueo el usuario, etc
      session.user = token.data as any;
      return session;
    },
  },
  providers: [
    // Aqui pueden ir proveedores como google, github, facebook, discord
    Credentials({
      // Esta parte se ejecuta cuando alguien intenta iniciar sesion, es la mas importante
      // credentials(formData) contiene el email y password enviado por el formulario
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        // otro ej con safeParse de zod = const result = z.string().safeParse("hola");
        // safeParse tiene la prop success y (data:{email, password} o error)
        if (!parsedCredentials.success) return null;

        // Ya tenemos el email y password, debemos buscar en la bd
        const { email, password } = parsedCredentials.data;

        //console.log('Auth.config');
        //console.log({ email, password });

        // Si todo sale bien y tenemos el acceso
        // Buscar el correo
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user) return null;

        // Comparar las contraseñas
        if (!bcrypt.compareSync(password, user.password)) return null;

        // Regresar el usuario sin el password
        const { password: _, ...rest } = user;
        //console.log({ rest });
        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
