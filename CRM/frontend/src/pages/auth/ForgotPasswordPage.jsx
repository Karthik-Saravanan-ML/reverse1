import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authApi from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AppLayout from '../../components/layout/AppLayout';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await authApi.forgotPassword(data);
      setSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col max-w-md">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {success ? (
          <div className="text-green-600 bg-green-50 p-4 rounded">
            Check your email! <Link to="/login" className="underline font-semibold ml-2">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Reset Password'}
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
