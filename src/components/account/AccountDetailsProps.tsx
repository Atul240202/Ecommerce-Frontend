import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';

interface AccountDetailsProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
  };
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Update display name if changed
      if (formData.displayName !== user.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.displayName,
        });
      }

      // Update email if changed
      if (formData.email !== user.email) {
        await updateEmail(currentUser, formData.email);
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        await updatePassword(currentUser, formData.newPassword);
      }

      setMessage({
        type: 'success',
        text: 'Account details updated successfully!',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred while updating your account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <h2 className='text-xl font-semibold mb-6'>Account Details</h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='displayName'>Display Name</Label>
            <Input
              id='displayName'
              name='displayName'
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='border-t pt-6'>
            <h3 className='text-lg font-medium mb-4'>Password Change</h3>
            <p className='text-sm text-gray-600 mb-4'>
              Leave blank to keep current password
            </p>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='currentPassword'>Current Password</Label>
                <Input
                  id='currentPassword'
                  name='currentPassword'
                  type='password'
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor='newPassword'>New Password</Label>
                <Input
                  id='newPassword'
                  name='newPassword'
                  type='password'
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
