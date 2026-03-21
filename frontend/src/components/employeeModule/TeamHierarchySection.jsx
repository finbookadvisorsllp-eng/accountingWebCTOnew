import React, { useState, useEffect } from 'react';
import { Users, Building2, ChevronDown, ChevronRight, Briefcase, UserCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { candidateAPI, clientAPI } from '../../services/api';

const DESIGNATION_ORDER = ['Manager', 'Senior Accountant', 'Accountant'];
const DESIGNATION_COLORS = {
  Manager: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200', dot: 'bg-violet-500' },
  'Senior Accountant': { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', dot: 'bg-amber-500' },
  Accountant: { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-200', dot: 'bg-sky-500' },
};

const TeamHierarchySection = ({ designation, isFullPage = false }) => {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  const [teamClients, setTeamClients] = useState({});
  const [expandedMember, setExpandedMember] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  async function fetchTeamData() {
    try {
      setLoading(true);
      const teamRes = await candidateAPI.getMyTeam();
      const data = teamRes.data.data;
      setTeamData(data);

      // Fetch clients for all team members
      if (data.team.length > 0) {
        const memberIds = data.team.map((m) => m._id).join(',');
        const clientRes = await clientAPI.getTeamClients(memberIds);
        setTeamClients(clientRes.data.grouped || {});
      }
    } catch (err) {
      console.error('Failed to fetch team data', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex items-center justify-center min-h-[200px]">
        <Loader2 size={24} className="text-[#3A565A] animate-spin" />
      </div>
    );
  }

  if (!teamData || teamData.team.length === 0) {
    if (isFullPage) {
      return (
        <div className="bg-white rounded-[20px] p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Users size={28} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Subordinates Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">You do not have any employees assigned reporting directly to you at this time.</p>
        </div>
      );
    }
    return null; // Don't show section if no team members
  }

  const { team, summary } = teamData;

  // Group team by designation
  const grouped = {};
  team.forEach((m) => {
    if (!grouped[m.designation]) grouped[m.designation] = [];
    grouped[m.designation].push(m);
  });

  const toggleExpand = (memberId) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats Bar */}
      <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#3A565A]/10 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-[#3A565A]" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">My Team</h3>
          </div>
          <Link
            to="/employee/team"
            className="text-xs font-semibold text-[#3A565A] hover:text-[#2a3e41] flex items-center space-x-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-[#3A565A] to-[#6DA4A4] rounded-xl p-3 text-white">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Total Team</p>
            <p className="text-2xl font-black mt-1">{summary.totalMembers}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-3 text-white">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Total Clients</p>
            <p className="text-2xl font-black mt-1">{summary.totalClients}</p>
          </div>
          {Object.entries(summary.byDesignation).map(([desig, count]) => {
            const colors = DESIGNATION_COLORS[desig] || DESIGNATION_COLORS['Accountant'];
            return (
              <div key={desig} className={`${colors.bg} rounded-xl p-3 border ${colors.ring}`}>
                <p className={`text-[9px] font-black uppercase tracking-widest ${colors.text} opacity-60`}>{desig}s</p>
                <p className={`text-2xl font-black mt-1 ${colors.text}`}>{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Members by Designation */}
      {DESIGNATION_ORDER.filter((d) => grouped[d]?.length > 0).map((desig) => {
        const members = grouped[desig];
        const colors = DESIGNATION_COLORS[desig] || DESIGNATION_COLORS['Accountant'];

        return (
          <div key={desig} className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <h4 className="font-bold text-slate-700 text-sm">{desig}s ({members.length})</h4>
            </div>

            <div className="space-y-2">
              {members.map((member) => {
                const isExpanded = expandedMember === member._id;
                const memberClients = teamClients[member._id] || [];

                return (
                  <div key={member._id} className="border border-slate-100 rounded-xl overflow-hidden">
                    {/* Member Row */}
                    <button
                      onClick={() => toggleExpand(member._id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} text-xs font-bold ring-2 ${colors.ring}`}>
                          {member.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{member.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{member.employeeId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg">
                          <Building2 size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{member.clientCount}</span>
                          <span className="text-[10px] text-slate-400">clients</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-slate-400" />
                        ) : (
                          <ChevronRight size={16} className="text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Client List */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-3">
                        {memberClients.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-2">No clients assigned</p>
                        ) : (
                          <div className="space-y-1.5">
                            {memberClients.map((client) => (
                              <Link
                                key={client._id}
                                to={`/employee/clients/${client._id}`}
                                className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-100 hover:border-[#6DA4A4] hover:shadow-sm transition-all group"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded bg-[#3A565A]/10 flex items-center justify-center">
                                    <Briefcase size={12} className="text-[#3A565A]" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-700 group-hover:text-[#3A565A] transition-colors">{client.entityName}</p>
                                    <p className="text-[10px] text-slate-400">{client.contactName || 'No contact'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    client.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {client.status?.toUpperCase()}
                                  </span>
                                  <ChevronRight size={12} className="text-slate-300 group-hover:text-[#3A565A] transition-colors" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamHierarchySection;
