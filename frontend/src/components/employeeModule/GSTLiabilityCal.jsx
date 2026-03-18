import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Loader2 } from 'lucide-react';
import { gstLiabilityAPI } from '../../services/api';
import { toast } from 'react-toastify';

const years = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const GSTLiabilityCal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id;

  const [activeTab, setActiveTab] = useState('GST Output and Input');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [yearlyData, setYearlyData] = useState([]);

  // SECTION 1: GST Output
  const [outputCgst, setOutputCgst] = useState('');
  const [outputSgst, setOutputSgst] = useState('');
  const [outputIgst, setOutputIgst] = useState('');
  const [outputCess, setOutputCess] = useState('');

  // SECTION 2: GST Input
  const [inputCgst, setInputCgst] = useState('');
  const [inputSgst, setInputSgst] = useState('');
  const [inputIgst, setInputIgst] = useState('');
  const [inputCess, setInputCess] = useState('');

  // SECTION 3: GST Carry Forward
  const [cfCgst, setCfCgst] = useState('');
  const [cfSgst, setCfSgst] = useState('');
  const [cfIgst, setCfIgst] = useState('');
  const [cfCess, setCfCess] = useState('');

  // Auto-calculated Totals
  const [totalOutput, setTotalOutput] = useState(0);
  const [totalInput, setTotalInput] = useState(0);
  const [totalCf, setTotalCf] = useState(0);

  // Final Calculations
  const [gstPayable, setGstPayable] = useState(0);
  const [nextMonthCf, setNextMonthCf] = useState(0);

  // Calculations Effect
  useEffect(() => {
    const o_total = (parseFloat(outputCgst) || 0) + (parseFloat(outputSgst) || 0) + (parseFloat(outputIgst) || 0) + (parseFloat(outputCess) || 0);
    const i_total = (parseFloat(inputCgst) || 0) + (parseFloat(inputSgst) || 0) + (parseFloat(inputIgst) || 0) + (parseFloat(inputCess) || 0);
    const c_total = (parseFloat(cfCgst) || 0) + (parseFloat(cfSgst) || 0) + (parseFloat(cfIgst) || 0) + (parseFloat(cfCess) || 0);

    setTotalOutput(o_total);
    setTotalInput(i_total);
    setTotalCf(c_total);

    const effective_input = i_total + c_total;
    const payable = o_total - effective_input;

    if (payable > 0) {
      setGstPayable(payable);
      setNextMonthCf(0);
    } else {
      setGstPayable(0);
      setNextMonthCf(Math.abs(payable));
    }
  }, [outputCgst, outputSgst, outputIgst, outputCess, inputCgst, inputSgst, inputIgst, inputCess, cfCgst, cfSgst, cfIgst, cfCess]);

  // Fetch Single Month Data
  useEffect(() => {
    if (clientId && selectedYear && selectedMonth) {
      fetchData();
    }
  }, [clientId, selectedYear, selectedMonth]);

  // Fetch Yearly Data
  useEffect(() => {
    if (clientId && selectedYear) {
      fetchYearlyData();
    }
  }, [clientId, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await gstLiabilityAPI.getSingleMonth(clientId, selectedYear, selectedMonth);
      const data = res?.data?.data;

      if (data) {
        setOutputCgst(data.output_cgst?.toString() || '');
        setOutputSgst(data.output_sgst?.toString() || '');
        setOutputIgst(data.output_igst?.toString() || '');
        setOutputCess(data.output_cess?.toString() || '');

        setInputCgst(data.input_cgst?.toString() || '');
        setInputSgst(data.input_sgst?.toString() || '');
        setInputIgst(data.input_igst?.toString() || '');
        setInputCess(data.input_cess?.toString() || '');

        setCfCgst(data.cf_cgst?.toString() || '');
        setCfSgst(data.cf_sgst?.toString() || '');
        setCfIgst(data.cf_igst?.toString() || '');
        setCfCess(data.cf_cess?.toString() || '');
      } else {
        resetForm();
      }
    } catch (err) {
      console.error('Failed to fetch GST data', err);
      toast.error('Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyData = async () => {
    try {
      const res = await gstLiabilityAPI.getByClientAndYear(clientId, selectedYear);
      setYearlyData(res?.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch yearly GST data', err);
    }
  };

  const resetForm = () => {
    setOutputCgst(''); setOutputSgst(''); setOutputIgst(''); setOutputCess('');
    setInputCgst(''); setInputSgst(''); setInputIgst(''); setInputCess('');
    setCfCgst(''); setCfSgst(''); setCfIgst(''); setCfCess('');
  };

  const handleSave = async () => {
    if (!selectedYear || !selectedMonth) {
      toast.warning('Please select Year and Month');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        client: clientId,
        year: selectedYear,
        month: selectedMonth,
        output_cgst: outputCgst || 0, output_sgst: outputSgst || 0, output_igst: outputIgst || 0, output_cess: outputCess || 0,
        input_cgst: inputCgst || 0, input_sgst: inputSgst || 0, input_igst: inputIgst || 0, input_cess: inputCess || 0,
        cf_cgst: cfCgst || 0, cf_sgst: cfSgst || 0, cf_igst: cfIgst || 0, cf_cess: cfCess || 0,
      };

      await gstLiabilityAPI.createOrUpdate(payload);
      toast.success('GST Liability saved successfully');
      fetchYearlyData();
    } catch (err) {
      console.error('Failed to save GST data', err);
      toast.error(err.response?.data?.message || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">GST Liability Cal</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-4 pt-6">
        
        {/* Year Dropdown */}
        <div className="relative">
           <div 
             className="bg-white rounded-[12px] border border-slate-200 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-300 shadow-sm transition-colors"
             onClick={() => setIsYearOpen(!isYearOpen)}
           >
              <span className={`font-medium ${selectedYear ? 'text-slate-800' : 'text-slate-500'}`}>
                {selectedYear || 'Financial Year Selection'}
              </span>
              {isYearOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
           </div>
           {isYearOpen && (
             <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-2 absolute w-full z-20">
               {years.map(year => (
                 <div key={year} onClick={() => { setSelectedYear(year); setIsYearOpen(false); }} className={`px-4 py-3 rounded-lg cursor-pointer ${selectedYear === year ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50'}`}>
                   <span>{year}</span>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Month Dropdown */}
        <div className="relative">
           <div 
             className={`bg-white rounded-[12px] border border-slate-200 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-300 shadow-sm ${(!selectedYear) && 'opacity-50 cursor-not-allowed'}`}
             onClick={() => selectedYear && setIsMonthOpen(!isMonthOpen)}
           >
              <span className="font-medium">{selectedMonth || 'Select Month'}</span>
              {isMonthOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
           </div>
           {isMonthOpen && selectedYear && (
              <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-4 absolute w-full z-10">
                <div className="grid grid-cols-3 gap-2">
                  {months.map(month => (
                    <div key={month} onClick={() => { setSelectedMonth(month); setIsMonthOpen(false); }} className={`text-center py-2 rounded-full cursor-pointer ${selectedMonth === month ? 'bg-[#3A565A] text-white' : 'hover:bg-slate-100'}`}>
                      {month}
                    </div>
                  ))}
                </div>
              </div>
           )}
        </div>

        {loading && !outputCgst && (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#3A565A]" size={36} /></div>
        )}

        {!loading && selectedYear && selectedMonth && (
           <div className="mt-6 space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <button className={`py-3 rounded-xl font-bold border-2 ${activeTab === 'GST Output and Input' ? 'bg-[#3A565A] text-white' : 'bg-white'}`} onClick={() => setActiveTab('GST Output and Input')}>GST Output & Input</button>
               <button className={`py-3 rounded-xl font-bold border-2 ${activeTab === 'GST Input C/f' ? 'bg-[#3A565A] text-white' : 'bg-white'}`} onClick={() => setActiveTab('GST Input C/f')}>GST Input C/f</button>
             </div>

             <div className="space-y-6">
               {activeTab === 'GST Output and Input' ? (
                 <>
                   <div className="space-y-3">
                      <h4 className="font-bold text-slate-700">GST Output</h4>
                      <InputField label="CGST" value={outputCgst} onChange={(e) => setOutputCgst(e.target.value)} />
                      <InputField label="SGST" value={outputSgst} onChange={(e) => setOutputSgst(e.target.value)} />
                      <InputField label="IGST" value={outputIgst} onChange={(e) => setOutputIgst(e.target.value)} />
                      <InputField label="Cess" value={outputCess} onChange={(e) => setOutputCess(e.target.value)} />
                      <TotalField label="Total Output GST" value={totalOutput} />
                   </div>
                   <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-bold text-slate-700">GST Input</h4>
                      <InputField label="CGST" value={inputCgst} onChange={(e) => setInputCgst(e.target.value)} />
                      <InputField label="SGST" value={inputSgst} onChange={(e) => setInputSgst(e.target.value)} />
                      <InputField label="IGST" value={inputIgst} onChange={(e) => setInputIgst(e.target.value)} />
                      <InputField label="Cess" value={inputCess} onChange={(e) => setInputCess(e.target.value)} />
                      <TotalField label="Total Input GST" value={totalInput} />
                   </div>
                 </>
               ) : (
                 <div className="space-y-3">
                    <h4 className="font-bold text-slate-700">GST Input Carry Forward</h4>
                    <InputField label="CGST" value={cfCgst} onChange={(e) => setCfCgst(e.target.value)} />
                    <InputField label="SGST" value={cfSgst} onChange={(e) => setCfSgst(e.target.value)} />
                    <InputField label="IGST" value={cfIgst} onChange={(e) => setCfIgst(e.target.value)} />
                    <InputField label="Cess" value={cfCess} onChange={(e) => setCfCess(e.target.value)} />
                    <TotalField label="Total Carry Forward GST" value={totalCf} />
                 </div>
               )}

               {/* Summary Section */}
               <div className="pt-6 border-t font-bold space-y-2">
                 <div className="flex justify-between text-slate-700 text-sm"><span>GST Payable</span><span className="text-red-600">{gstPayable.toFixed(2)}</span></div>
                 <div className="flex justify-between text-slate-700 text-sm"><span>Next Month Carry Forward</span><span className="text-green-600">{nextMonthCf.toFixed(2)}</span></div>
               </div>

               <div className="pt-4 flex justify-center">
                  <button onClick={handleSave} disabled={loading} className="bg-[#3A565A] text-white px-12 py-3 rounded-full font-bold disabled:opacity-50">Save</button>
               </div>
             </div>
           </div>
        )}

        {/* Yearly History Section */}
        {selectedYear && yearlyData.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Past GST Records ({selectedYear})</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-sm">
                    <th className="p-3 font-semibold">Month</th>
                    <th className="p-3 font-semibold text-right">Output GST</th>
                    <th className="p-3 font-semibold text-right">Input GST</th>
                    <th className="p-3 font-semibold text-right">Payable</th>
                    <th className="p-3 font-semibold text-right">C/f Next</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {yearlyData.map((item) => (
                    <tr key={item._id} className="text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">{item.month}</td>
                      <td className="p-3 text-right">{item.output_total?.toFixed(2)}</td>
                      <td className="p-3 text-right">{item.input_total?.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-red-600">{item.gst_payable?.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-green-600">{item.next_month_carry_forward?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600 text-xs md:text-sm font-medium">{label}</span>
    <input type="number" step="0.01" min="0" value={value} onChange={onChange} className="w-1/2 md:w-3/5 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-right" placeholder="0.00" />
  </div>
);

const TotalField = ({ label, value }) => (
  <div className="flex items-center justify-between font-bold">
    <span className="text-slate-800 text-xs md:text-sm">{label}</span>
    <div className="w-1/2 md:w-3/5 text-right px-3 py-2 text-[#3A565A]">{value.toFixed(2)}</div>
  </div>
);

export default GSTLiabilityCal;
