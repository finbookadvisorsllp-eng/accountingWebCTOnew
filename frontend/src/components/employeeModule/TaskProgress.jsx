import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  Search,
  ListFilter,
  BarChart3,
  Lock,
} from 'lucide-react';

/* ─────────── status config ─────────── */
const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    icon: AlertCircle,
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    progress: 'bg-amber-400',
  },
  Process: {
    label: 'Process',
    icon: Clock,
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    progress: 'bg-blue-400',
  },
  Complete: {
    label: 'Complete',
    icon: CheckCircle2,
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    progress: 'bg-emerald-400',
  },
};

const STATUS_ORDER = ['Pending', 'Process', 'Complete'];

/* ─────────── initial data ─────────── */
const INITIAL_TASKS = [
  { id: 1, name: 'Compliance Audit Check',        category: 'Audit',     dueDate: '2025-04-15', assignee: 'Rahul S.' },
  { id: 2, name: 'Financial Report Review',        category: 'Finance',   dueDate: '2025-04-10', assignee: 'Neha P.'  },
  { id: 3, name: 'Client VAT Reconciliation',      category: 'Tax',       dueDate: '2025-04-20', assignee: 'Sanjay G.' },
  { id: 4, name: 'GST Return Filing',              category: 'Tax',       dueDate: '2025-04-18', assignee: 'Rahul S.' },
  { id: 5, name: 'Annual Balance Sheet',           category: 'Finance',   dueDate: '2025-05-01', assignee: 'Neha P.'  },
  { id: 6, name: 'TDS Certificate Generation',     category: 'Tax',       dueDate: '2025-04-25', assignee: 'Sanjay G.' },
  { id: 7, name: 'Bank Statement Verification',    category: 'Finance',   dueDate: '2025-04-12', assignee: 'Rahul S.' },
  { id: 8, name: 'Payroll Processing',             category: 'HR',        dueDate: '2025-04-30', assignee: 'Neha P.'  },
  { id: 9, name: 'Insurance Renewal Follow-up',    category: 'Compliance',dueDate: '2025-05-05', assignee: 'Sanjay G.' },
  { id: 10,name: 'Statutory Compliance Report',    category: 'Compliance',dueDate: '2025-04-28', assignee: 'Rahul S.' },
];

const INITIAL_STATUSES = {
  1: 'Pending', 2: 'Complete', 3: 'Process', 4: 'Pending', 5: 'Complete',
  6: 'Process', 7: 'Complete', 8: 'Process', 9: 'Pending', 10: 'Complete',
};

/* ══════════════════ MAIN COMPONENT ══════════════════ */
const TaskProgress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  /* ── state ── */
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  /* ── handlers ── */
  const changeStatus = useCallback((taskId, newStatus) => {
    setStatuses((prev) => ({ ...prev, [taskId]: newStatus }));
    setOpenDropdown(null);
  }, []);

  const toggleDropdown = useCallback((taskId) => {
    setOpenDropdown((prev) => (prev === taskId ? null : taskId));
  }, []);

  /* ── derived ── */
  const tasks = useMemo(() => {
    let list = INITIAL_TASKS.map((t) => ({ ...t, status: statuses[t.id] }));

    if (filterStatus !== 'All') {
      list = list.filter((t) => t.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q)
      );
    }

    return list;
  }, [statuses, filterStatus, searchQuery]);

  const counts = useMemo(() => {
    const all = Object.values(statuses);
    return {
      total: all.length,
      Pending: all.filter((s) => s === 'Pending').length,
      Process: all.filter((s) => s === 'Process').length,
      Complete: all.filter((s) => s === 'Complete').length,
    };
  }, [statuses]);

  const completionPct = counts.total ? Math.round((counts.Complete / counts.total) * 100) : 0;

  /* ────────────── JSX ────────────── */
  return (
    <div
      className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full"
      onClick={() => openDropdown && setOpenDropdown(null)}
    >
      {/* ═══ Header ═══ */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-6 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-[#3A565A]" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-tight">Task Progress</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Track and manage task statuses</p>
          </div>
        </div>

        {/* Desktop search */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A]/30 w-56 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Mobile search */}
      <div className="md:hidden px-4 pt-3 pb-1">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A]/30 transition-all"
          />
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="p-4 sm:px-6 md:px-10 md:py-6 w-full max-w-4xl mx-auto space-y-5">

        {/* ── Overall progress bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3A565A]" />
              <span className="font-semibold text-slate-700 text-sm md:text-base">Overall Progress</span>
            </div>
            <span className="text-sm font-bold text-[#3A565A]">{completionPct}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3A565A] to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{counts.Complete} of {counts.total} tasks completed</p>
        </div>

        {/* ── Summary cards row ── */}
        <div className="grid grid-cols-3 gap-3">
          {STATUS_ORDER.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterStatus((prev) => (prev === s ? 'All' : s));
                }}
                className={`relative overflow-hidden rounded-2xl border p-3 md:p-4 text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'border-[#3A565A] bg-[#3A565A]/5 shadow-md'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${cfg.progress} opacity-60`} />
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cfg.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">{counts[s]}</p>
                {isActive && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold text-[#3A565A] bg-[#3A565A]/10 px-1.5 py-0.5 rounded-md uppercase">
                    Filtered
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Filter row ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListFilter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">
              Showing:{' '}
              <span className="font-semibold text-slate-700">{filterStatus === 'All' ? 'All Tasks' : filterStatus}</span>
              {' '}({tasks.length})
            </span>
          </div>
          {filterStatus !== 'All' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilterStatus('All');
              }}
              className="text-xs font-medium text-[#3A565A] hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* ── Task list ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* Table header (desktop) */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_100px_110px_120px_140px] md:grid-cols-[1fr_120px_120px_130px_160px] gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Task Name</span>
            <span>Category</span>
            <span>Due Date</span>
            <span>Assignee</span>
            <span>Status</span>
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Search size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No tasks found.</p>
            </div>
          ) : (
            tasks.map((task, idx) => {
              const cfg = STATUS_CONFIG[task.status];
              const Icon = cfg.icon;
              const isLast = idx === tasks.length - 1;
              const isOpen = openDropdown === task.id;
              const isLocked = task.status === 'Complete';

              return (
                <div
                  key={task.id}
                  className={`relative sm:grid sm:grid-cols-[1fr_100px_110px_120px_140px] md:grid-cols-[1fr_120px_120px_130px_160px] gap-2 items-center px-5 py-3.5 hover:bg-slate-50/80 transition-colors ${
                    !isLast ? 'border-b border-slate-100' : ''
                  }`}
                >
                  {/* Task name */}
                  <div className="flex items-center gap-2.5 min-w-0 mb-2 sm:mb-0">
                    <Icon size={16} className={`shrink-0 ${cfg.dot.replace('bg-', 'text-')}`} />
                    <span className="text-sm font-medium text-slate-700 truncate">{task.name}</span>
                  </div>

                  {/* Category */}
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">{task.category}</span>

                  {/* Due Date */}
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">{task.dueDate}</span>

                  {/* Assignee */}
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">{task.assignee}</span>

                  {/* Status dropdown */}
                  <div className="relative flex items-center gap-2 sm:gap-0">
                    {/* Mobile meta info */}
                    <div className="flex sm:hidden items-center gap-2 text-[10px] text-slate-400 mr-auto">
                      <span>{task.category}</span>
                      <span>•</span>
                      <span>{task.dueDate}</span>
                    </div>

                    {isLocked ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold select-none ${cfg.badge} opacity-90`}
                        title="Status locked — task is complete"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                        <Lock size={10} className="text-emerald-500/60" />
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(task.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all select-none ${cfg.badge} hover:opacity-80`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                        <ChevronDown
                          size={12}
                          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}

                    {/* Dropdown */}
                    {isOpen && !isLocked && (
                      <div
                        className="absolute right-0 bottom-full mb-1 z-50 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden min-w-[140px] animate-in fade-in slide-in-from-bottom-1 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUS_ORDER.map((s) => {
                          const sCfg = STATUS_CONFIG[s];
                          const SIcon = sCfg.icon;
                          const isSelected = task.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => changeStatus(task.id, s)}
                              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-50 text-[#3A565A] font-bold'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <SIcon size={14} className={sCfg.dot.replace('bg-', 'text-')} />
                              {sCfg.label}
                              {isSelected && (
                                <CheckCircle2 size={12} className="ml-auto text-[#3A565A]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default TaskProgress;
