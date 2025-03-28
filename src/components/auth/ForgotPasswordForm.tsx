import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from '../../components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process request');
      }

      // Store the token in localStorage for OTP verification
      localStorage.setItem('resetToken', data.token);

      toast({
        title: 'OTP Sent',
        description:
          'Please check your email for the OTP to reset your password.',
      });

      // Navigate to OTP verification page
      navigate('/verify-reset-otp', {
        state: {
          email,
        },
      });
    } catch (error: any) {
      toast({
        title: 'Request Failed',
        description: error.message,
        variant: 'destructive',
      });
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-6'>Forgot Password</h2>
      <p className='text-center text-gray-600 mb-6'>
        Enter your email address and we'll send you an OTP to reset your
        password.
      </p>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'border-red-500' : ''}
            placeholder='Enter your email address'
            required
          />
          {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </Button>

        <p className='text-center text-sm'>
          Remember your password?{' '}
          <a href='/login' className='text-blue-600 hover:underline'>
            Back to Login
          </a>
        </p>
      </form>
    </div>
  );
}
