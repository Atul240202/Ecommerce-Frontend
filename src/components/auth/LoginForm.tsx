import type React from 'react';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('login response', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth token in cookies
      const tokenExpiry = rememberMe ? 30 : 1; // 30 days or 1 day
      Cookies.set('authToken', data.token, { expires: tokenExpiry });
      Cookies.set('isLoggedIn', 'true', { expires: tokenExpiry });

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

      // Navigate to home page or previous page
      navigate('/');
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

  return (
    <div className='w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Sign In</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
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

        <div>
          <div className='flex justify-between items-center'>
            <Label htmlFor='password'>Password</Label>
            <a
              href='/forgot-password'
              className='text-sm text-blue-600 hover:underline'
            >
              Forgot Password?
            </a>
          </div>
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

        <div className='flex items-center space-x-2'>
          <Checkbox
            id='remember'
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor='remember' className='text-sm font-normal'>
            Remember me
          </Label>
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <p className='text-center text-sm'>
          Don't have an account?{' '}
          <a href='/register' className='text-blue-600 hover:underline'>
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
