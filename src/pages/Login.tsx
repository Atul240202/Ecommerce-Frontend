import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/layouts/MainLayout';
import { auth } from '../App';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      Cookies.set('authToken', token);
      Cookies.set('isLoggedIn', 'true');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      Cookies.set('authToken', token);
      Cookies.set('isLoggedIn', 'true');
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <MainLayout>
      <div className='flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold text-gray-900'>User Login</h1>
            <p className='mt-2 text-sm text-[#6b83b6]'>Welcome back!</p>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleLogin}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email / Phone / Username *
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='mt-1'
                  placeholder='stevenjobs@gmail.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password *
                </label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='mt-1'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Checkbox id='remember-me' />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900'
                >
                  Remember me
                </label>
              </div>
              <div className='text-sm'>
                <Link
                  href='/forgot-password'
                  className='text-[#4280ef] hover:text-[#425a8b]'
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-[#4280ef] hover:bg-[#425a8b]'
              size='lg'
            >
              Log In
            </Button>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <Link
                  href='/register'
                  className='text-[#4280ef] hover:text-[#425a8b]'
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    Use Social Network Account
                  </span>
                </div>
              </div>

              <div className='mt-6'>
                <Button
                  variant='outline'
                  className='w-full flex items-center justify-center gap-2'
                  onClick={handleGoogleSignIn}
                >
                  <img
                    src='/placeholder.svg?height=20&width=20'
                    alt='Google'
                    width={20}
                    height={20}
                  />
                  Sign in with Google
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
