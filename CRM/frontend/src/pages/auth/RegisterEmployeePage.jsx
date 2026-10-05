import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Users, CheckCircle } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Required'),
  employeeId: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  position: z.string().min(1, 'Required'),
  skills: z.string().optional(),
  experienceLevel: z.string().min(1, 'Required'),
});

export default function RegisterEmployeePage() {
  const [submitted, setSubmitted] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.registerEmployee,
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-xl">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-gray-600 mb-6">Your request for an Employee account has been submitted to your Project Manager for approval.</p>
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 shadow-lg">
          <Users size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Employee Registration</h2>
        <p className="mt-2 text-sm text-gray-600">Register as an employee to join project teams.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-200">
        <form className="space-y-4" onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Work Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employee ID" {...register('employeeId')} error={errors.employeeId?.message} />
            <Input label="Department" {...register('department')} error={errors.department?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Position" {...register('position')} error={errors.position?.message} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select {...register('experienceLevel')} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select...</option>
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior (1-3 yrs)</option>
                <option value="MID_LEVEL">Mid-Level (3-5 yrs)</option>
                <option value="SENIOR">Senior (5+ yrs)</option>
                <option value="LEAD">Lead / Principal</option>
              </select>
              {errors.experienceLevel && <p className="text-xs text-red-500 mt-1">{errors.experienceLevel.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <Input placeholder="e.g. React, Java, SQL, UI Design" {...register('skills')} error={errors.skills?.message} />
          </div>

          {registerMutation.error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{registerMutation.error.response?.data?.message || 'Error submitting request'}</div>
          )}

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg" loading={registerMutation.isPending}>
            Submit Registration
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
