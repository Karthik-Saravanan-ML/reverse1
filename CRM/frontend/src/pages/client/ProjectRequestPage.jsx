import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import projectsApi from '../../api/projectsApi';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  businessProblem: z.string().min(1, 'Required'),
  initialRequirements: z.string().min(1, 'Required'),
  expectedFeatures: z.string().min(1, 'Required'),
  priority: z.string().min(1, 'Required'),
  desiredStartDate: z.string().min(1, 'Required'),
  desiredEndDate: z.string().min(1, 'Required'),
  budget: z.string().optional().transform(v => v ? Number(v) : undefined),
  notes: z.string().optional()
});

export default function ProjectRequestPage() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const submitReq = useMutation({
    mutationFn: projectsApi.submitRequest,
    onSuccess: () => setSuccess(true)
  });

  const onSubmit = (data) => submitReq.mutate(data);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Submit Project Request</h1>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Request Submitted Successfully!</h2>
            <p className="text-green-700 mb-6">Your project request has been received and is currently under review by our team.</p>
            <Link to="/client/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input label="Project Title" {...register('title')} error={errors.title?.message} />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Problem</label>
                <textarea className="w-full border rounded-md p-2" rows={3} {...register('businessProblem')} />
                {errors.businessProblem && <span className="text-red-500 text-xs">{errors.businessProblem.message}</span>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Requirements</label>
                <textarea className="w-full border rounded-md p-2" rows={3} {...register('initialRequirements')} />
                {errors.initialRequirements && <span className="text-red-500 text-xs">{errors.initialRequirements.message}</span>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Features</label>
                <textarea className="w-full border rounded-md p-2" rows={3} {...register('expectedFeatures')} />
                {errors.expectedFeatures && <span className="text-red-500 text-xs">{errors.expectedFeatures.message}</span>}
              </div>

              <Select label="Priority" {...register('priority')} error={errors.priority?.message} options={[
                {value: '', label: 'Select...'},
                {value: 'LOW', label: 'LOW'},
                {value: 'MEDIUM', label: 'MEDIUM'},
                {value: 'HIGH', label: 'HIGH'},
                {value: 'CRITICAL', label: 'CRITICAL'}
              ]} />
              
              <Input label="Budget (Optional)" type="number" step="0.01" {...register('budget')} />
              <Input label="Desired Start Date" type="date" {...register('desiredStartDate')} error={errors.desiredStartDate?.message} />
              <Input label="Desired End Date" type="date" {...register('desiredEndDate')} error={errors.desiredEndDate?.message} />
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea className="w-full border rounded-md p-2" rows={2} {...register('notes')} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSubmitting || submitReq.isPending} className="px-8 py-2">
                {isSubmitting || submitReq.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
}
