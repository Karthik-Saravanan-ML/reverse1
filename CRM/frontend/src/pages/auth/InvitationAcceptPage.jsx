import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { CheckCircle, AlertCircle, Brain, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[a-z]/, 'Must include lowercase')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', test: password.length >= 8 },
    { label: 'Uppercase', test: /[A-Z]/.test(password) },
    { label: 'Lowercase', test: /[a-z]/.test(password) },
    { label: 'Number', test: /[0-9]/.test(password) },
    { label: 'Special char', test: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.test).length;
  const colors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {checks.map((c) => (
          <span key={c.label} className={`text-xs ${c.test ? 'text-green-600' : 'text-gray-400'}`}>
            {c.test ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function InvitationAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPwd, setShowPwd] = useState(false);
  const [password, setPassword] = useState('');

  const { data: invitation, isLoading, error: invError } = useQuery({
    queryKey: ['invitation', token],
    queryFn: () => authApi.validateInvitation(token),
    retry: false,
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
  });

  const watchedPassword = watch('password', '');

  const acceptMutation = useMutation({
    mutationFn: (data) => authApi.acceptInvitation({ token, ...data }),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      navigate('/profile-photo', { replace: true });
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (invError || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center shadow-xl">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid or Expired Invitation</h2>
          <p className="text-gray-500 text-sm">This invitation link is no longer valid. Please request a new one from your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-3 shadow-lg">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-500 text-sm mt-1">Set up your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Invitation for:</strong> {invitation.email}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Role: <strong>{invitation.role.replace('_', ' ')}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => acceptMutation.mutate(data))} className="space-y-4">
            <div>
              <div className="relative">
                <Input
                  label="Create Password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Strong password..."
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={watchedPassword} />
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password..."
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            {acceptMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
                {acceptMutation.error.response?.data?.message || 'Failed to activate account'}
              </div>
            )}

            <Button type="submit" className="w-full" loading={acceptMutation.isPending}>
              Create Account & Continue
            </Button>
          </form>
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">
          After setting your password, you'll upload your profile photo (required)
        </p>
      </div>
    </div>
  );
}
