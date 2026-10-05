import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Brain, CheckCircle } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department: z.string().min(1, 'Department is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  requestReason: z.string().min(10, 'Please provide a brief reason for access'),
});

export default function RegisterManagerPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.registerManager,
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-xl">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-gray-600 mb-6">
            Your request for a Project Manager account has been submitted to the administration team. You will receive an email once your account is approved.
          </p>
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-lg">
          <Brain size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Request Manager Access</h2>
        <p className="mt-2 text-sm text-gray-600">
          Apply for a Project Manager account. Subject to admin approval.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-200">
          <form className="space-y-5" onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            
            <Input label="Work Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Phone Number" type="tel" {...register('phone')} error={errors.phone?.message} />
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Department" {...register('department')} error={errors.department?.message} />
              <Input label="Job Title" {...register('jobTitle')} error={errors.jobTitle?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Access</label>
              <textarea
                {...register('requestReason')}
                rows={3}
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.requestReason ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Briefly describe why you need manager access..."
              />
              {errors.requestReason && <p className="text-xs text-red-500 mt-1">{errors.requestReason.message}</p>}
            </div>

            {registerMutation.error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                {registerMutation.error.response?.data?.message || 'Failed to submit request'}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={registerMutation.isPending}>
              Submit Request
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
