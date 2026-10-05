import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Brain, AlertCircle } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const from = location.state?.from?.pathname;
  const ROLE_DASHBOARDS = {
    ADMIN: '/admin/dashboard',
    PROJECT_MANAGER: '/manager/dashboard',
    EMPLOYEE: '/employee/dashboard',
    CLIENT: '/client/dashboard',
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      const destination = from || ROLE_DASHBOARDS[data.user.role] || '/';
      navigate(destination, { replace: true });
    },
  });

  const reason = new URLSearchParams(location.search).get('reason');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Native CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Intelligent Project Memory Platform</p>
        </div>

        {/* Alert */}
        {reason === 'account_inactive' && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            Your account is inactive. Please contact your administrator.
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {loginMutation.error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
                <AlertCircle size={14} />
                {loginMutation.error.response?.data?.message || 'Invalid email or password'}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loginMutation.isPending}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">Don't have an account? Request access:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { to: '/register/manager', label: 'Manager' },
                { to: '/register/employee', label: 'Employee' },
                { to: '/register/client', label: 'Client' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-center text-xs text-blue-600 border border-blue-200 rounded-lg px-2 py-1.5 hover:bg-blue-50 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Access is subject to admin approval. All activity is monitored.
        </p>
      </div>
    </div>
  );
}
