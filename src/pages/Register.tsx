import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  getFirestore,
  collection,
} from 'firebase/firestore';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/layouts/MainLayout';
import { auth, db } from '../App';

// Initialize Firestore

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== rePassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user profile with display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Create a reference to the users collection and the specific user document
      const usersRef = collection(db, 'users');
      const userDocRef = doc(usersRef, userCredential.user.uid);

      // Store additional user data in Firestore
      await setDoc(userDocRef, {
        fullName,
        email,
        phone,
        createdAt: serverTimestamp(),
      });

      const token = await userCredential.user.getIdToken();
      Cookies.set('authToken', token);
      Cookies.set('isLoggedIn', 'true');
      navigate('/');
    } catch (error: any) {
      console.error('Error registering:', error);
      setError(error.message || 'An error occurred during registration');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Create a reference to the users collection and the specific user document
      const usersRef = collection(db, 'users');
      const userDocRef = doc(usersRef, result.user.uid);

      // Store additional user data in Firestore
      await setDoc(
        userDocRef,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber || '',
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ); // Use merge to avoid overwriting existing data

      const token = await result.user.getIdToken();
      Cookies.set('authToken', token);
      Cookies.set('isLoggedIn', 'true');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'An error occurred during Google sign-in');
    }
  };

  return (
    <MainLayout>
      <div className='flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold text-gray-900'>
              Create an account
            </h1>
          </div>
          {error && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
              role='alert'
            >
              <span className='block sm:inline'>{error}</span>
            </div>
          )}
          <form className='mt-8 space-y-6' onSubmit={handleRegister}>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='fullName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name *
                </label>
                <Input
                  id='fullName'
                  name='fullName'
                  type='text'
                  required
                  className='mt-1'
                  placeholder='Steven Job'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email *
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='mt-1'
                  placeholder='stevenjob@gmail.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone Number *
                </label>
                <Input
                  id='phone'
                  name='phone'
                  type='tel'
                  required
                  className='mt-1'
                  placeholder='+1 234 567 8900'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder='••••••••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='rePassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Re-Password *
                </label>
                <Input
                  id='rePassword'
                  name='rePassword'
                  type='password'
                  required
                  className='mt-1'
                  placeholder='••••••••••••••'
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox id='terms' required />
              <label htmlFor='terms' className='text-sm text-gray-600'>
                By clicking Register button, you agree our{' '}
                <Link
                  href='/terms'
                  className='text-[#4280ef] hover:text-[#425a8b]'
                >
                  terms
                </Link>{' '}
                and{' '}
                <Link
                  href='/policy'
                  className='text-[#4280ef] hover:text-[#425a8b]'
                >
                  policy
                </Link>
                .
              </label>
            </div>

            <Button
              type='submit'
              className='w-full bg-[#4280ef] hover:bg-[#425a8b]'
              size='lg'
            >
              Sign Up
            </Button>

            <div className='text-center'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-[#4280ef] hover:text-[#425a8b]'
                >
                  Sign in
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
                  Sign up with Google
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
