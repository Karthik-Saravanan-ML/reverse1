import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { adminApi } from '../../api/adminApi'; // using an endpoint to be created, or userApi
import Button from '../../components/ui/Button';
import { Camera, Upload } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function ProfilePhotoUploadPage() {
  const { user, token, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile) => {
      const formData = new FormData();
      formData.append('photo', uploadFile);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/users/me/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      updateUser({ profilePhotoUrl: data.photoUrl });
      
      // Navigate to dashboard
      const dashMap = {
        ADMIN: '/admin/dashboard',
        PROJECT_MANAGER: '/manager/dashboard',
        EMPLOYEE: '/employee/dashboard',
        CLIENT: '/client/dashboard'
      };
      navigate(dashMap[user.role] || '/');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to upload photo');
    }
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('File must be smaller than 5MB');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Add Profile Photo</h2>
          <p className="text-gray-500 mt-2 text-sm">
            A profile photo is mandatory to help your team identify you.
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-dashed overflow-hidden ${preview ? 'border-blue-500' : 'border-gray-300 bg-gray-50'}`}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={40} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              )}
            </div>
            <label className="absolute inset-0 w-full h-full cursor-pointer">
              <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
            </label>
            <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg pointer-events-none">
              <Upload size={16} />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <Button 
          className="w-full" 
          disabled={!file} 
          loading={uploadMutation.isPending}
          onClick={() => uploadMutation.mutate(file)}
        >
          Upload and Continue
        </Button>
      </div>
    </div>
  );
}
