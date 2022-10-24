import Logo from '@/components/Logo';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='min-h-screen bg-purple text-white'>
      <div className='absolute top-0 w-full'>
        <div className='layout py-6'>
          <Logo />
        </div>
      </div>

      {children}
      <Toaster />
    </div>
  );
}
