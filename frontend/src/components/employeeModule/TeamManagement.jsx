import React from 'react';
import TeamHierarchySection from './TeamHierarchySection';
import useAuthStore from '../../store/authStore';

const TeamManagement = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-4 lg:p-6 bg-slate-50/50 min-h-screen space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">Team Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">View and manage your reporting subordinates.</p>
        </div>
      </div>

      {/* Render the Hierarchy Section for managing the layout */}
      <TeamHierarchySection designation={user?.designation} isFullPage={true} />
    </div>
  );
};

export default TeamManagement;