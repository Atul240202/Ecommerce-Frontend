import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from '../../components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordOtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Get email from location state
  const email = location.state?.email || '';

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check if token exists
    const token = localStorage.getItem('resetToken');
    if (!token) {
      toast({
        title: 'Session Expired',
        description:
          'Your password reset session has expired. Please try again.',
        variant: 'destructive',
      });
      navigate('/forgot-password');
    }

    return () => clearInterval(timer);
  }, [navigate]);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('resetToken');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resend-reset-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast({
        title: 'OTP Sent',
        description: 'A new OTP has been sent to your email.',
      });

      // Reset countdown
      setCountdown(60);
      setResendDisabled(true);
    } catch (error: any) {
      toast({
        title: 'Failed to Resend OTP',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if OTP is complete
    if (otp.some((digit) => !digit)) {
      toast({
        title: 'Incomplete OTP',
        description: 'Please enter the complete 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('resetToken');
      const otpString = otp.join('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-reset-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: otpString }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      toast({
        title: 'OTP Verified',
        description:
          'OTP verified successfully. You can now reset your password.',
      });

      // Navigate to reset password page
      navigate('/reset-password', { state: { email, token: data.token } });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-center mb-2'>Verify OTP</h2>
      <p className='text-center text-gray-600 mb-6'>
        We've sent a 6-digit OTP to your email {email}
      </p>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex justify-center gap-2'>
          {otp.map((digit, index) => (
            <Input
              key={index}
              type='text'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className='w-12 h-12 text-center text-xl'
            />
          ))}
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>

        <div className='text-center'>
          <p className='text-sm text-gray-600 mb-2'>Didn't receive the OTP?</p>
          <Button
            type='button'
            variant='outline'
            onClick={handleResendOtp}
            disabled={resendDisabled || isLoading}
          >
            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </Button>
        </div>
      </form>
    </div>
  );
}
