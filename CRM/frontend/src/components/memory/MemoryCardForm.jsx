import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memoryApi } from '../../api/memoryApi';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const CARD_TYPES = [
  { value: 'REQUIREMENT', label: 'Requirement' },
  { value: 'DECISION', label: 'Decision' },
  { value: 'APPROVAL', label: 'Approval' },
  { value: 'ACTION', label: 'Action Item' },
  { value: 'QUESTION', label: 'Question' },
  { value: 'RISK', label: 'Risk' },
  { value: 'ISSUE', label: 'Issue' },
  { value: 'CHANGE_REQUEST', label: 'Change Request' },
  { value: 'CLIENT_FEEDBACK', label: 'Client Feedback' },
];

const VISIBILITY_OPTIONS = [
  { value: 'INTERNAL_ONLY', label: 'Internal Only (team + manager)' },
  { value: 'PROJECT_MEMBERS', label: 'All Project Members' },
  { value: 'CLIENT_SHARED', label: 'Client Shared' },
];

const schema = z.object({
  type: z.string().min(1, 'Card type is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  visibility: z.string().min(1, 'Visibility is required'),
  sourceReference: z.string().optional(),
  eventDate: z.string().optional(),
});

export default function MemoryCardForm({ projectId, isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'PROJECT_MEMBERS' },
  });

  const createMutation = useMutation({
    mutationFn: (data) => memoryApi.createCard(projectId, { ...data, extractionMethod: 'MANUAL' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['memory-cards', projectId]);
      reset();
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Memory Card" size="lg">
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
        <Select
          label="Card Type"
          options={CARD_TYPES}
          {...register('type')}
          error={errors.type?.message}
        />
        <Input
          label="Title"
          placeholder="Brief, descriptive title..."
          {...register('title')}
          error={errors.title?.message}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            {...register('content')}
            rows={5}
            placeholder="Detailed content of this memory card..."
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
        </div>
        <Select
          label="Visibility"
          options={VISIBILITY_OPTIONS}
          {...register('visibility')}
          error={errors.visibility?.message}
        />
        <Input
          label="Source Reference (optional)"
          placeholder="e.g. Meeting: Kickoff - Jan 15, 2024"
          {...register('sourceReference')}
        />
        <Input
          label="Event Date (optional)"
          type="date"
          {...register('eventDate')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createMutation.isPending}>Create Card</Button>
        </div>
      </form>
    </Modal>
  );
}
