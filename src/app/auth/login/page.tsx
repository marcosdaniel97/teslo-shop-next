import { titleFont } from '@/config/fonts';
import Link from 'next/link';
import { LoginForm } from './ui/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="w-full max-w-md px-5">
        <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

        <LoginForm />
      </div>
    </div>
  );
}
