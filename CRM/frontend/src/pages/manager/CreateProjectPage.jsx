import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import projectsApi from '../../api/projectsApi';
import clientsApi from '../../api/clientsApi'; // assuming it exists or using projectsApi

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().optional(),
  projectType: z.string().optional(),
  priority: z.string().optional(),
  startDate: z.string().min(1, 'Required'),
  targetDate: z.string().min(1, 'Required'),
  clientId: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => !data.startDate || !data.targetDate || new Date(data.targetDate) >= new Date(data.startDate), {
  message: "Target date must be after start date",
  path: ["targetDate"]
});

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: () => clientsApi.getClients().catch(() => []) });

  const create = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: (res) => navigate(`/projects/${res.id || res.data?.id || 'new'}`)
  });

  const onSubmit = (data) => create.mutate(data);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register('title')} error={errors.title?.message} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="mt-1 w-full border rounded p-2" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Project Type" {...register('projectType')} />
            <Select label="Priority" {...register('priority')} options={[
              {value: 'LOW', label: 'LOW'},
              {value: 'MEDIUM', label: 'MEDIUM'},
              {value: 'HIGH', label: 'HIGH'},
              {value: 'CRITICAL', label: 'CRITICAL'},
            ]} />
            <Input label="Start Date" type="date" {...register('startDate')} error={errors.startDate?.message} />
            <Input label="Target Date" type="date" {...register('targetDate')} error={errors.targetDate?.message} />
            <Select label="Client" {...register('clientId')} options={clients.map(c => ({value: c.id, label: c.companyName || c.name}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea className="mt-1 w-full border rounded p-2" {...register('notes')} />
          </div>
          <Button type="submit" disabled={isSubmitting || create.isPending}>
            {isSubmitting || create.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
