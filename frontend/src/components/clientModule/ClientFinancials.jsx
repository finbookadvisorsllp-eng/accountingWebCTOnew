import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { pnlAPI, balanceSheetAPI } from '../../services/api';

const ClientFinancials = () => {
  const [loading, setLoading] = useState(true);
  const [pnlRecords, setPnlRecords] = useState([]);
  const [bsSummary, setBsSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('pnl'); // pnl or bs
  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clientId = user._id;

      // 1. Fetch full PnL list items
      const pnlRes = await pnlAPI.getByYear(clientId, currentYear);
      if (pnlRes.data?.data) {
        setPnlRecords(pnlRes.data.data);
      }

      // 2. Fetch Balance Sheet Summary
      try {
        const bsRes = await balanceSheetAPI.getSummary(clientId, currentYear);
        if (bsRes.data?.data) {
          setBsSummary(bsRes.data.data);
        }
      } catch (e) {}

    } catch (error) {
      console.error("Error fetching financials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A565A]"></div>
      </div>
    );
  }

  // Group P&L into Income/Expense arrays
  const incomes = pnlRecords.filter(r => r.type === 'income');
  const expenses = pnlRecords.filter(r => r.type === 'expense');

  const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Financial Reports</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">Detailed statements for Financial Year {currentYear}</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'pnl' ? 'bg-white text-[#3A565A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Profit & Loss
        </button>
        <button
          onClick={() => setActiveTab('bs')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'bs' ? 'bg-white text-[#3A565A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Balance Sheet Summary
        </button>
      </div>

      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">TOTAL INCOME</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{totalIncome.toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">TOTAL EXPENSES</p>
                <h3 className="text-2xl font-black text-rose-600 mt-1">₹{totalExpense.toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingDown size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold">NET PROFIT</p>
                <h3 className={`text-2xl font-black mt-1 ${totalIncome - totalExpense >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                  ₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          {/* Details Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-50 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2 text-base">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Income Sources</span>
              </h3>
              {incomes.length > 0 ? (
                <div className="space-y-3">
                  {incomes.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.sub_category}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{item.category}</p>
                      </div>
                      <p className="text-sm font-black text-emerald-600">₹{item.amount?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-6 text-sm font-semibold">No Income items recorded.</p>
              )}
            </div>

            {/* Expense Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-50 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2 text-base">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span>Expense Breakdown</span>
              </h3>
              {expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.sub_category}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{item.category}</p>
                      </div>
                      <p className="text-sm font-black text-rose-600">₹{item.amount?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-6 text-sm font-semibold">No Expense items recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bs' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-50 p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="font-black text-slate-800 text-xl">Balance Sheet Summary</h3>
            <p className="text-xs text-slate-500 mt-1">Quick view of total assets and liabilities</p>
          </div>
          {bsSummary ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl">
                <span className="font-bold text-slate-700">Total Assets</span>
                <span className="font-black text-teal-600 text-lg">₹{(bsSummary.total_assets || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                <span className="font-bold text-slate-700">Total Liabilities</span>
                <span className="font-black text-amber-600 text-lg">₹{(bsSummary.total_liabilities || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-black text-lg text-slate-800">
                <span>Net Equity / Capital</span>
                <span className="text-[#3A565A]">₹{((bsSummary.total_assets || 0) - (bsSummary.total_liabilities || 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400 py-10 text-sm font-medium">No Balance Sheet Summary found for {currentYear}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientFinancials;
