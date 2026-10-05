import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Building2, CheckCircle } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Required'),
  companyName: z.string().min(1, 'Company name required'),
  industry: z.string().min(1, 'Industry required'),
  website: z.string().optional(),
  projectRequirement: z.string().min(10, 'Please describe your project requirement briefly'),
});

export default function RegisterClientPage() {
  const [submitted, setSubmitted] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.registerClient,
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-xl">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-gray-600 mb-6">Your client registration and initial project request have been submitted. Our team will review it and contact you shortly.</p>
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-xl mb-4 shadow-lg">
          <Building2 size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Client Registration</h2>
        <p className="mt-2 text-sm text-gray-600">Register your organization and submit a project request.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-200">
        <form className="space-y-4" onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
          <div className="pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Official Email" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
            </div>
          </div>

          <div className="pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company Details</h3>
            <Input label="Company Name" className="mb-4" {...register('companyName')} error={errors.companyName?.message} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Industry" {...register('industry')} error={errors.industry?.message} />
              <Input label="Website (Optional)" {...register('website')} error={errors.website?.message} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Initial Requirement</h3>
            <div>
              <textarea
                {...register('projectRequirement')}
                rows={4}
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 ${errors.projectRequirement ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Describe your project needs..."
              />
              {errors.projectRequirement && <p className="text-xs text-red-500 mt-1">{errors.projectRequirement.message}</p>}
            </div>
          </div>

          {registerMutation.error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{registerMutation.error.response?.data?.message || 'Error submitting request'}</div>
          )}

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" size="lg" loading={registerMutation.isPending}>
            Submit Registration
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
