'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useActionState, useEffect } from 'react';
import { authenticate } from '@/actions';
import { IoInformationOutline } from 'react-icons/io5';
import clsx from 'clsx';
//import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  // authenticate = Es la función que se ejecutará cuando el form se envíe
  // undefinded = estado inicial del formulario
  // state = estado que devuelve el authenticate
  // dispatch = para enviar el formulario
  const [state, dispatch] = useActionState(authenticate, undefined); // conecta el form del cliente con una Server Action
  //const router = useRouter();

  useEffect(() => {
    if (state === 'Success') {
      //redireccionar
      //router.replace('/');
      window.location.replace('/');
    }
  }, [state]);

  return (
    // todos los inputs que tienen name viajan en el formData de forma automática
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border border-gray-300 bg-gray-200 rounded mb-5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        type="email"
        name="email"
      />

      <label htmlFor="email">Contraseña</label>
      <input
        className="px-5 py-2 border border-gray-300 bg-gray-200 rounded mb-5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        type="password"
        name="password"
      />

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === 'CredentialsSignin' && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">Verifique las credenciales</p>
          </div>
        )}
      </div>

      <LoginButton />

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

// Es sin props xq esta dentro de un form que usa una Server Action (authenticate)
function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={clsx({ 'btn-primary': !pending, 'btn-disabled': pending })}
    >
      Ingresar
    </button>
  );
}
