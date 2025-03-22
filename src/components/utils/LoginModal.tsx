'use client';

import type React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../App';
import Cookies from 'js-cookie';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  productName?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  productName,
}: LoginModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth token in cookies
      Cookies.set('authToken', data.token, { expires: 1 });
      Cookies.set('isLoggedIn', 'true', { expires: 1 });

      // Store user info in localStorage for easy access
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
        })
      );

      // Trigger storage event to update header
      window.dispatchEvent(new Event('storage'));

      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in.',
      });

      onLoginSuccess();
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      Cookies.set('authToken', token, { expires: 1 });
      Cookies.set('isLoggedIn', 'true', { expires: 1 });

      // Store user info in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: result.user.uid,
          fullName: result.user.displayName,
          email: result.user.email,
        })
      );

      // Trigger storage event to update header
      window.dispatchEvent(new Event('storage'));

      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in with Google.',
      });

      onLoginSuccess();
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        title: 'Login Failed',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <p className='text-sm text-gray-500 mt-1'>
            {productName
              ? `Please login to add ${productName} to your cart.`
              : 'Please login to continue with checkout.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
          </div>

          <div className='text-sm'>
            <a
              href='/forgot-password'
              className='text-blue-600 hover:underline'
            >
              Forgot Password?
            </a>
          </div>
        </form>

        <DialogFooter className='flex flex-col sm:flex-row gap-2'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='button' variant='outline' onClick={handleRegisterClick}>
            Register
          </Button>
          <Button type='submit' onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing In...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </DialogFooter>

        <div className='relative mt-4'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          className='w-full flex items-center justify-center gap-2 mt-4'
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <img
            src='/placeholder.svg?height=20&width=20'
            alt='Google'
            width={20}
            height={20}
          />
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
