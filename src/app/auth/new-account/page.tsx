import { titleFont } from '@/config/fonts';
import Link from 'next/link';
import { RegisterForm } from './ui/RegisterForm';

export default function NewAccountPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="w-full max-w-md px-5">
        <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

        <RegisterForm />
      </div>
    </div>
  );
}
