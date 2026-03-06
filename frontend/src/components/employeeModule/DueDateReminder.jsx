import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Download, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/* ─────────────────────── sample data ─────────────────────── */
const SAMPLE_DATA = [
  {
    complianceId: 'CRT-002',
    complianceTitle: 'Income Tax',
    description: 'Audit / Half Yearly Compliance',
    entityName: 'Finance Advisors',
    pan: 'ELPQK1651L',
    issuingAuthority: 'Income Tax Department',
    issuingContact: 'info@incometax.gov.in',
    servingAuthority: 'CPC Bengaluru',
    servingContact: 'cpc@incometax.gov.in',
    startDate: '01/04/2025',
    expiryDate: '31/03/2026',
    renewalRequired: 'Yes',
    dueDate: '15/09/2025',
    amountDue: '25,000',
    frequencyType: 'Yearly',
    retention1: 'Y-Active',
    retention2: 'Pending',
    status: 'Active',
    paymentStatus: 'Paid',
    paymentDate: '10/09/2025',
    netEnrollment: '14300_FL_pgfy_co.pdf',
    documentUpload: 'tax_return_approved',
    paymentTxn: 'e_txn_apprvd_copy',
    agreementCopy: 'none_applicable',
  },
  {
    complianceId: 'CRT-003',
    complianceTitle: 'GST Return',
    description: 'Monthly GST Return Filing',
    entityName: 'Finance Advisors',
    pan: '27AADCF1234K1ZP',
    issuingAuthority: 'CBIC',
    issuingContact: 'helpdesk@gst.gov.in',
    servingAuthority: 'State Jurisdiction',
    servingContact: 'gst.state@gov.in',
    startDate: '01/04/2025',
    expiryDate: '30/04/2025',
    renewalRequired: 'Yes',
    dueDate: '20/04/2025',
    amountDue: '1,500',
    frequencyType: 'Yearly',
    retention1: 'Y-Active',
    retention2: '-',
    status: 'Active',
    paymentStatus: 'Pending',
    paymentDate: '-',
    netEnrollment: '14500_PI_filing_co.pdf',
    documentUpload: 'bank_business_levy',
    paymentTxn: 'fresh_lease_entry',
    agreementCopy: '-',
  },
  {
    complianceId: 'CRT-004',
    complianceTitle: 'MCA Filing',
    description: 'Annual Return Filing',
    entityName: 'Finance Advisors',
    pan: 'U67120MH2020PTC',
    issuingAuthority: 'MCA',
    issuingContact: 'support@mca.gov.in',
    servingAuthority: 'ROC Mumbai',
    servingContact: 'roc.mumbai@mca.gov.in',
    startDate: '01/10/2025',
    expiryDate: '31/12/2025',
    renewalRequired: 'No',
    dueDate: '31/12/2025',
    amountDue: '14,000',
    frequencyType: 'Yearly',
    retention1: 'E-Active',
    retention2: '-',
    status: 'Active',
    paymentStatus: 'Unpaid',
    paymentDate: '-',
    netEnrollment: '24800_Registrant_co',
    documentUpload: 'form_ike_taxation',
    paymentTxn: '-',
    agreementCopy: '-',
  },
  {
    complianceId: 'CRT-005',
    complianceTitle: 'PF Monthly',
    description: 'Employee PF Contribution',
    entityName: 'Finance Advisors',
    pan: 'MHBAN00456780001234',
    issuingAuthority: 'EPFO',
    issuingContact: 'epfigms@epfindia.gov.in',
    servingAuthority: 'Regional PF Office',
    servingContact: 'rpfc.mumbai@epfindia.gov.in',
    startDate: '01/05/2025',
    expiryDate: '31/05/2025',
    renewalRequired: 'Yes',
    dueDate: '15/05/2025',
    amountDue: '45,000',
    frequencyType: 'Monthly',
    retention1: '-',
    retention2: '-',
    status: 'Active',
    paymentStatus: 'Paid',
    paymentDate: '13/05/2025',
    netEnrollment: '-',
    documentUpload: '-',
    paymentTxn: '-',
    agreementCopy: '-',
  },
  {
    complianceId: 'CRT-006',
    complianceTitle: 'MSME Udyam',
    description: 'MSME Registration Renewal',
    entityName: 'Finance Advisors',
    pan: 'UDYAM-MH-26-0012345',
    issuingAuthority: 'Ministry of MSME',
    issuingContact: 'champion@nic.in',
    servingAuthority: 'DI MSME Mumbai',
    servingContact: 'di-mumbai@dcmsme.gov.in',
    startDate: '15/06/2025',
    expiryDate: '14/06/2026',
    renewalRequired: 'Yes',
    dueDate: '14/06/2026',
    amountDue: '-',
    frequencyType: '-',
    retention1: '-',
    retention2: '-',
    status: 'Pending',
    paymentStatus: '-',
    paymentDate: '-',
    netEnrollment: '74000_re_edits_co1',
    documentUpload: '-',
    paymentTxn: '-',
    agreementCopy: '-',
  },
  {
    complianceId: 'CRT-007',
    complianceTitle: 'Fire NOC',
    description: 'Fire Safety Compliance',
    entityName: 'Finance Advisors',
    pan: 'NOC/MH/2025/0891',
    issuingAuthority: 'Fire Department',
    issuingContact: 'firenoc@maharashtra.gov.in',
    servingAuthority: 'Municipal Corp',
    servingContact: 'fire.bmc@gov.in',
    startDate: '01/03/2025',
    expiryDate: '28/02/2026',
    renewalRequired: 'Yes',
    dueDate: '01/02/2026',
    amountDue: '-',
    frequencyType: '-',
    retention1: '-',
    retention2: '-',
    status: 'Active',
    paymentStatus: '-',
    paymentDate: '-',
    netEnrollment: '-',
    documentUpload: 'Renewed',
    paymentTxn: '-',
    agreementCopy: 'Agreement_copy',
  },
  {
    complianceId: 'CRT-008',
    complianceTitle: 'Shop Act',
    description: 'Shop & Establishment License',
    entityName: 'Finance Advisors',
    pan: 'MH/SA/2025/3456',
    issuingAuthority: 'Labour Department',
    issuingContact: 'labour@maharashtra.gov.in',
    servingAuthority: 'Inspector of Shops',
    servingContact: 'shops.inspector@gov.in',
    startDate: '01/01/2025',
    expiryDate: '31/12/2025',
    renewalRequired: 'Yes',
    dueDate: '01/12/2025',
    amountDue: '-',
    frequencyType: '-',
    retention1: 'Y-Active',
    retention2: 'Y-Active',
    status: 'Active',
    paymentStatus: '-',
    paymentDate: '-',
    netEnrollment: '-',
    documentUpload: 'Renewed',
    paymentTxn: '-',
    agreementCopy: '-',
  },
];

const COLUMNS = [
  { key: 'complianceId',     label: 'Compliance ID',       group: 'Compliance Details',     minW: 120 },
  { key: 'complianceTitle',  label: 'Compliance Title',    group: 'Compliance Details',     minW: 140 },
  { key: 'description',     label: 'Description',          group: 'Compliance Details',     minW: 180 },
  { key: 'entityName',      label: 'Entity Name',          group: 'Entity Information',     minW: 140 },
  { key: 'pan',             label: 'PAN / Reg. / Acct No.',group: 'Entity Information',     minW: 170 },
  { key: 'issuingAuthority',label: 'Issuing Authority',    group: 'Authority Details',      minW: 160 },
  { key: 'issuingContact',  label: 'Issuing Contact',      group: 'Authority Details',      minW: 170 },
  { key: 'servingAuthority',label: 'Serving Authority',    group: 'Authority Details',      minW: 150 },
  { key: 'servingContact',  label: 'Serving Contact',      group: 'Authority Details',      minW: 180 },
  { key: 'startDate',       label: 'Start Date',           group: 'Dates & Duration',       minW: 110 },
  { key: 'expiryDate',      label: 'Expiry Date',          group: 'Dates & Duration',       minW: 110 },
  { key: 'renewalRequired', label: 'Renewal Required',     group: 'Dates & Duration',       minW: 130 },
  { key: 'dueDate',         label: 'Due Date',             group: 'Dates & Duration',       minW: 110 },
  { key: 'amountDue',       label: 'Amount Due',           group: 'Financial Details',      minW: 110 },
  { key: 'frequencyType',   label: 'Frequency Type',       group: 'Financial Details',      minW: 120 },
  { key: 'retention1',      label: 'Retention 1 (Days)',   group: 'Retention & Status',     minW: 130 },
  { key: 'retention2',      label: 'Retention 2 (Days)',   group: 'Retention & Status',     minW: 130 },
  { key: 'status',          label: 'Status',               group: 'Retention & Status',     minW: 100 },
  { key: 'paymentStatus',   label: 'Payment Status',       group: 'Payment Information',    minW: 130 },
  { key: 'paymentDate',     label: 'Payment Date',         group: 'Payment Information',    minW: 120 },
  { key: 'netEnrollment',   label: 'Net Enrollment / Reg.',group: 'Documents',              minW: 170 },
  { key: 'documentUpload',  label: 'Document Upload',      group: 'Documents',              minW: 150 },
  { key: 'paymentTxn',      label: 'Payment / Txn No.',    group: 'Documents',              minW: 150 },
  { key: 'agreementCopy',   label: 'Agreement Copy',       group: 'Documents',              minW: 140 },
];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

/* ─────── grouped header builder ─────── */
function buildGroupedHeaders(columns) {
  const groups = [];
  let current = null;
  for (const col of columns) {
    if (current && current.group === col.group) {
      current.span += 1;
    } else {
      current = { group: col.group, span: 1 };
      groups.push(current);
    }
  }
  return groups;
}

/* ─────── badge component ─────── */
const StatusBadge = ({ value, type }) => {
  if (!value || value === '-') return <span className="text-slate-400">—</span>;

  let bg = 'bg-slate-100 text-slate-600';
  if (type === 'status') {
    if (value === 'Active')  bg = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    if (value === 'Pending') bg = 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  }
  if (type === 'payment') {
    if (value === 'Paid')      bg = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    if (value === 'Pending')   bg = 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
    if (value === 'Unpaid')    bg = 'bg-red-50 text-red-700 ring-1 ring-red-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${bg}`}>
      {value}
    </span>
  );
};

/* ────────────────────── main component ────────────────────── */
const DueDateReminder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  /* ── state ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const tableWrapperRef = useRef(null);

  /* ── derived data ── */
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return SAMPLE_DATA;
    const q = searchQuery.toLowerCase();
    return SAMPLE_DATA.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = String(a[sortKey] || '').toLowerCase();
      const bVal = String(b[sortKey] || '').toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, rowsPerPage]);

  const handleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return key;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const groupedHeaders = useMemo(() => buildGroupedHeaders(COLUMNS), []);

  /* ── render cell ── */
  const renderCell = (row, col) => {
    const val = row[col.key];
    if (col.key === 'status')        return <StatusBadge value={val} type="status" />;
    if (col.key === 'paymentStatus') return <StatusBadge value={val} type="payment" />;
    if (col.key === 'renewalRequired') {
      if (val === 'Yes') return <span className="text-emerald-600 font-medium">Yes</span>;
      if (val === 'No')  return <span className="text-slate-500">No</span>;
    }
    if (col.key === 'amountDue' && val && val !== '-') {
      return <span className="font-semibold text-slate-800">₹{val}</span>;
    }
    if (!val || val === '-') return <span className="text-slate-400">—</span>;
    return <span className="text-slate-700">{val}</span>;
  };

  /* ────────────── JSX ────────────── */
  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full">

      {/* ═══ Header ═══ */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-6 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-[#3A565A]" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-tight">Due Date Reminder</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Compliance tracking & due‑date management</p>
          </div>
        </div>

        {/* Desktop search + actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search records…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A]/30 w-56 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-[#3A565A] text-white hover:bg-[#2a3e41] transition-colors shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </header>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pt-3 pb-1">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A]/30 transition-all"
          />
        </div>
      </div>

      {/* ═══ Summary strip ═══ */}
      <div className="px-4 sm:px-6 md:px-10 py-3">
        <div className="flex flex-wrap gap-3">
          <SummaryCard label="Total Records" value={filteredData.length} color="bg-[#3A565A]" />
          <SummaryCard label="Active" value={filteredData.filter(r=>r.status==='Active').length} color="bg-emerald-500" />
          <SummaryCard label="Pending" value={filteredData.filter(r=>r.status==='Pending').length} color="bg-amber-500" />
          <SummaryCard label="Unpaid" value={filteredData.filter(r=>r.paymentStatus==='Unpaid').length} color="bg-red-500" />
        </div>
      </div>

      {/* ═══ Table ═══ */}
      <div className="px-4 sm:px-6 md:px-10 pb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* scroll wrapper */}
          <div ref={tableWrapperRef} className="overflow-x-auto due-date-table-scroll">
            <table className="due-date-table w-full border-collapse text-xs sm:text-sm">

              {/* ── col widths ── */}
              <colgroup>
                {COLUMNS.map((col) => (
                  <col key={col.key} style={{ minWidth: col.minW }} />
                ))}
              </colgroup>

              <thead>
                {/* grouped header row */}
                <tr className="bg-[#D6E8EE]">
                  {groupedHeaders.map((g, i) => (
                    <th
                      key={i}
                      colSpan={g.span}
                      className="px-3 py-2 text-[10px] sm:text-xs font-bold text-[#3A565A] uppercase tracking-wider text-center border-b border-[#b3d4df] border-r border-r-[#b3d4df] last:border-r-0 whitespace-nowrap"
                    >
                      {g.group}
                    </th>
                  ))}
                </tr>

                {/* individual column headers */}
                <tr className="bg-[#E8F4F8]">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-[#3A565A] border-b border-[#cce3eb] border-r border-r-[#d4e8ef] last:border-r-0 cursor-pointer hover:bg-[#d6e8ee] transition-colors select-none whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                          <span className="text-[#3A565A]/60">{sortDir === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="text-center py-16 text-slate-400 text-sm">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, idx) => (
                    <tr
                      key={row.complianceId}
                      className={`
                        ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                        hover:bg-[#EDF6F9] transition-colors group
                      `}
                    >
                      {COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 border-b border-slate-100 border-r border-r-slate-100 last:border-r-0 whitespace-nowrap"
                        >
                          {renderCell(row, col)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── pagination ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#3A565A]/30"
              >
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="ml-2">
                {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)}–{Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <PagBtn disabled={currentPage === 1} onClick={() => setCurrentPage(1)} aria-label="First page">
                <ChevronsLeft size={14} />
              </PagBtn>
              <PagBtn disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} aria-label="Previous page">
                <ChevronLeft size={14} />
              </PagBtn>
              <span className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white rounded-lg border border-slate-200 min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <PagBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} aria-label="Next page">
                <ChevronRight size={14} />
              </PagBtn>
              <PagBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} aria-label="Last page">
                <ChevronsRight size={14} />
              </PagBtn>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ Mobile card view (< 640px) ═══ */}
      <div className="sm:hidden px-4 pb-6 space-y-3">
        {paginatedData.map((row) => (
          <MobileCard key={row.complianceId} row={row} />
        ))}
        {paginatedData.length === 0 && (
          <p className="text-center py-10 text-slate-400 text-sm">No records found.</p>
        )}
      </div>
    </div>
  );
};

/* ─────────── sub-components ─────────── */
const SummaryCard = ({ label, value, color }) => (
  <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm min-w-[120px]">
    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
    <div>
      <p className="text-[10px] sm:text-xs text-slate-500 leading-none">{label}</p>
      <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight">{value}</p>
    </div>
  </div>
);

const PagBtn = ({ children, disabled, ...rest }) => (
  <button
    disabled={disabled}
    className={`p-1.5 rounded-lg border transition-colors ${
      disabled
        ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-white'
        : 'border-slate-200 text-slate-600 hover:bg-[#3A565A] hover:text-white hover:border-[#3A565A] bg-white cursor-pointer'
    }`}
    {...rest}
  >
    {children}
  </button>
);

const MobileCard = ({ row }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-[#3A565A] bg-[#E8F4F8] px-2.5 py-1 rounded-lg">{row.complianceId}</span>
      <StatusBadge value={row.status} type="status" />
    </div>
    <h3 className="font-semibold text-slate-800 text-sm">{row.complianceTitle}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{row.description}</p>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-slate-100">
      <MobileField label="Entity" value={row.entityName} />
      <MobileField label="Due Date" value={row.dueDate} />
      <MobileField label="Amount Due" value={row.amountDue !== '-' ? `₹${row.amountDue}` : '—'} />
      <MobileField label="Frequency" value={row.frequencyType} />
      <MobileField label="Start Date" value={row.startDate} />
      <MobileField label="Expiry Date" value={row.expiryDate} />
      <MobileField label="Renewal" value={row.renewalRequired} />
      <MobileField label="Payment" value={row.paymentStatus} />
    </div>
  </div>
);

const MobileField = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
    <p className="text-xs font-medium text-slate-700">{!value || value === '-' ? '—' : value}</p>
  </div>
);

export default DueDateReminder;
