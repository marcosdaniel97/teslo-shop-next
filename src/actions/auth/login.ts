'use server';

import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';

// ...

// Este es el server action que ejecuta el formulario
// prevState = estado anterior del formulario | formData = datos del formulario
// prevState puede ser: contador de intentos de login, errores acumulados, validaciones progresivas
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    //console.log(Object.fromEntries(formData));
    // credentials podría ser google, github, etc...
    // 'credentials' hace referencia a Credentials(el id interno es 'credentials') de auth.config
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Success';
  } catch (error) {
    if ((error as any).type === 'CredentialsSignin') {
      return 'CredentialsSignin';
    }

    return 'UnknownError';
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo iniciar sesión',
    };
  }
};
