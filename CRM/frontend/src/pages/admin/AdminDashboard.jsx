import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import AppLayout from '../../components/layout/AppLayout';
import Spinner from '../../components/ui/Spinner';
import { Users, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

function StatCard({ title, value, icon: Icon, color, to }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <Link to={to} className={`block p-6 rounded-2xl border transition-shadow hover:shadow-md ${colors[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/60`}>
          <Icon size={24} />
        </div>
        <ArrowRight size={20} className="opacity-50" />
      </div>
      <div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-sm font-medium opacity-80">{title}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getSystemStats(),
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12"><Spinner /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-500 mt-1">Platform overview and access controls.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={Users} 
            color="blue" 
            to="/admin/users" 
          />
          <StatCard 
            title="Pending Registrations" 
            value={stats?.pendingRegistrations || 0} 
            icon={ShieldCheck} 
            color="purple" 
            to="/admin/registrations" 
          />
          <StatCard 
            title="System Audit Logs" 
            value="View" 
            icon={Clock} 
            color="green" 
            to="/admin/audit" 
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/registrations" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ShieldCheck size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Access Requests</h3>
                <p className="text-xs text-gray-500">Approve or reject new manager accounts</p>
              </div>
            </Link>
            <Link to="/admin/users" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-xs text-gray-500">View and update user accounts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
