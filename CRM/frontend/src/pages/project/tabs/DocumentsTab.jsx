import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../../../api/documentsApi';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import { FileText, Upload, Download, Eye, Lock, Users, Globe, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const VISIBILITY_ICONS = {
  INTERNAL_ONLY: { icon: Lock, label: 'Internal', color: 'text-red-500' },
  PROJECT_MEMBERS: { icon: Users, label: 'Members', color: 'text-blue-500' },
  CLIENT_SHARED: { icon: Globe, label: 'Client', color: 'text-green-500' },
};

const FILE_TYPE_COLORS = {
  PDF: 'bg-red-50 text-red-600',
  DOCX: 'bg-blue-50 text-blue-600',
  TXT: 'bg-gray-50 text-gray-600',
};

export default function DocumentsTab({ projectId }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const canUpload = ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'].includes(user?.role);

  const { data: docsPage, isLoading } = useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentsApi.getDocuments(projectId),
  });

  const downloadMutation = useMutation({
    mutationFn: (docId) => documentsApi.getDownloadUrl(projectId, docId),
    onSuccess: ({ url }) => window.open(url, '_blank'),
  });

  const docs = docsPage?.content || docsPage || [];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('visibility', 'PROJECT_MEMBERS');
      await documentsApi.upload(projectId, formData);
      queryClient.invalidateQueries(['documents', projectId]);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          Documents
          <span className="text-sm font-normal text-gray-500">({docs.length})</span>
        </h2>
        {canUpload && (
          <label className="cursor-pointer">
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} className="sr-only" />
            <Button size="sm" loading={uploading} as="span">
              <Upload size={14} className="mr-1" /> Upload
            </Button>
          </label>
        )}
      </div>

      {docs.length === 0 ? (
        <EmptyState
          icon={<FileText size={40} />}
          title="No documents yet"
          description="Upload PDFs and DOCX files to share with the project team"
        />
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => {
            const vis = VISIBILITY_ICONS[doc.visibility] || VISIBILITY_ICONS.PROJECT_MEMBERS;
            const VisIcon = vis.icon;
            return (
              <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-200 transition-colors">
                <div className={`px-2 py-1 rounded text-xs font-bold ${FILE_TYPE_COLORS[doc.fileType] || 'bg-gray-50 text-gray-600'}`}>
                  {doc.fileType}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{doc.originalFileName}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                    <span className={`flex items-center gap-0.5 ${vis.color}`}>
                      <VisIcon size={10} /> {vis.label}
                    </span>
                    {doc.processingStatus && (
                      <span className={`px-1.5 py-0.5 rounded ${
                        doc.processingStatus === 'INDEXED' ? 'bg-green-100 text-green-600' :
                        doc.processingStatus === 'FAILED' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {doc.processingStatus}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => downloadMutation.mutate(doc.id)}
                  disabled={downloadMutation.isPending}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
