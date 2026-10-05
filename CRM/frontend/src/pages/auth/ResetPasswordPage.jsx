import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authApi from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AppLayout from '../../components/layout/AppLayout';

const schema = z.object({
  password: z.string().min(8, 'Min 8 chars'),
  confirm: z.string()
}).refine(data => data.password === data.confirm, { message: "Mismatch", path: ["confirm"] });

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  
  const pwd = watch('password') || '';
  const strength = pwd.length > 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) ? 'Strong' : pwd.length > 5 ? 'Medium' : 'Weak';

  const onSubmit = async (data) => {
    try {
      await authApi.resetPassword({ token, password: data.password });
      alert("Success! Check your email");
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col max-w-md">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="New Password" type="password" {...register('password')} error={errors.password?.message} />
          <div className="text-sm text-gray-500">Strength: {strength}</div>
          <Input label="Confirm" type="password" {...register('confirm')} error={errors.confirm?.message} />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Resetting...' : 'Reset'}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
