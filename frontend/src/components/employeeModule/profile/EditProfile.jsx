import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPen, FaSave, FaTimes, FaShieldAlt } from "react-icons/fa";
import { candidateAPI } from "../../../services/api";
import { useParams } from "react-router-dom";

// ─── Reusable Card Component ───
const FormCard = ({ title, children, isEditable, editMode, onSave, onCancel, onEdit, saving, readOnlyNotice }) => (
  <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    
    <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
        {isEditable && (
          <span className="text-[10px] bg-[#3A565A]/10 text-[#3A565A] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            {editMode ? "Editing" : "Editable"}
          </span>
        )}
      </div>

      {isEditable && (
        <div className="flex items-center gap-2">
           {editMode ? (
             <>
               <button onClick={onCancel} className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition" title="Cancel">
                 <FaTimes />
               </button>
               <button onClick={onSave} disabled={saving} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3A565A] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#2c4245] transition disabled:opacity-70">
                 {saving ? "Saving..." : <><FaSave /> Save</>}
               </button>
             </>
           ) : (
             <button onClick={onEdit} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-[#3A565A] rounded-lg text-sm font-bold hover:bg-slate-200 transition">
               <FaPen size={12} /> Edit
             </button>
           )}
        </div>
      )}
    </div>

    <div className="p-6 md:p-8 flex-1 overflow-y-auto">
      {readOnlyNotice && (
        <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-6 text-sm text-orange-800 flex items-start gap-3 font-medium">
          <FaShieldAlt className="text-orange-400 mt-0.5 flex-shrink-0" />
          <p>{readOnlyNotice}</p>
        </div>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value, editMode, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col sm:flex-row py-4 sm:items-center border-b border-slate-50 last:border-0 last:pb-0">
    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest w-full sm:w-1/3 mb-2 sm:mb-0">
      {label}
    </span>
    <div className="w-full sm:w-2/3">
      {editMode && onChange ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-base text-slate-800 font-medium bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/30 focus:bg-white transition"
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      ) : (
        <span className="text-base text-slate-700 font-medium">
          {value || "—"}
        </span>
      )}
    </div>
  </div>
);

const EditProfile = ({ profileContext }) => {
  const { section } = useParams();
  const { profile, setProfile, fetchProfile } = profileContext;
  
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Reset edit mode when swapping tabs
    setEditMode(false);
    if (profile) populateEditData(profile);
  }, [section, profile]);

  const populateEditData = (data) => {
    setEditData({
      familyBackground: {
        fatherSpouseFirstName: data.familyBackground?.fatherSpouseFirstName || data.familyBackground?.fatherOrSpouseName || "",
        fatherSpouseLastName: data.familyBackground?.fatherSpouseLastName || "",
        fatherSpouseContact: data.familyBackground?.fatherSpouseContact || "",
      },
      contactInfo: {
        alternateMobile: data.contactInfo?.alternateMobile || "",
        permanentAddress: {
          address: data.contactInfo?.permanentAddress?.address || "",
          city: data.contactInfo?.permanentAddress?.city || "",
          state: data.contactInfo?.permanentAddress?.state || "",
          pin: data.contactInfo?.permanentAddress?.pin || "",
        },
      },
      legalCompliance: {
        aadharNumber: data.legalCompliance?.aadharNumber || "",
        panNumber: data.legalCompliance?.panNumber || "",
        bankDetails: {
          accountHolderName: data.legalCompliance?.bankDetails?.accountHolderName || "",
          bankName: data.legalCompliance?.bankDetails?.bankName || "",
          accountNumber: data.legalCompliance?.bankDetails?.accountNumber || "",
          ifscCode: data.legalCompliance?.bankDetails?.ifscCode || "",
          branchName: data.legalCompliance?.bankDetails?.branchName || "",
        },
        emergencyContact: {
          name: data.legalCompliance?.emergencyContact?.name || "",
          relationship: data.legalCompliance?.emergencyContact?.relationship || "",
          contact: data.legalCompliance?.emergencyContact?.contact || "",
          email: data.legalCompliance?.emergencyContact?.email || "",
        },
      },
      exitedPersonalInfo: {
        maritalStatus: data.exitedPersonalInfo?.maritalStatus || "",
        nationality: data.exitedPersonalInfo?.nationality || "",
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const formData = new FormData();
      
      // We only append the JSON slices, we don't need to append avatar here
      formData.append("familyBackground", JSON.stringify(editData.familyBackground));
      formData.append("contactInfo", JSON.stringify(editData.contactInfo));
      formData.append("legalCompliance", JSON.stringify(editData.legalCompliance));
      formData.append("exitedPersonalInfo", JSON.stringify(editData.exitedPersonalInfo));
      
      const res = await candidateAPI.updateOwnProfile(user._id, formData);
      setProfile(res.data.data);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save updates");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    populateEditData(profile);
    setEditMode(false);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (!profile) return null;

  // Render specific tab content
  switch (section) {
    case "basic":
      return (
        <FormCard 
          title="Basic Information" 
          isEditable={true} 
          editMode={editMode} 
          onEdit={() => setEditMode(true)} 
          onCancel={handleCancel} 
          onSave={handleSave} 
          saving={saving}
        >
          <InfoRow label="Email Identity" value={profile.personalInfo?.email} />
          <InfoRow label="Primary Phone" value={`${profile.personalInfo?.primaryContact?.countryCode || ""} ${profile.personalInfo?.primaryContact?.number || ""}`} />
          <InfoRow label="Date of Birth" value={formatDate(profile.personalInfo?.dateOfBirth)} />
          <InfoRow label="Gender" value={profile.personalInfo?.gender} />
          
          <div className="py-4"><div className="h-px bg-slate-100 w-full" /></div>
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Additional Details</h4>
          
          <InfoRow
            label="Marital Status"
            editMode={editMode}
            value={editMode ? editData.exitedPersonalInfo?.maritalStatus : profile.exitedPersonalInfo?.maritalStatus}
            onChange={(v) => setEditData({ ...editData, exitedPersonalInfo: { ...editData.exitedPersonalInfo, maritalStatus: v } })}
          />
          <InfoRow
            label="Nationality"
            editMode={editMode}
            value={editMode ? editData.exitedPersonalInfo?.nationality : profile.exitedPersonalInfo?.nationality}
            onChange={(v) => setEditData({ ...editData, exitedPersonalInfo: { ...editData.exitedPersonalInfo, nationality: v } })}
          />
        </FormCard>
      );

    case "employment":
      return (
        <FormCard 
          title="Employment Details" 
          isEditable={false} 
          readOnlyNotice="These records are strictly maintained by HR and Administration. They cannot be edited directly by the employee."
        >
          <InfoRow label="Employee ID" value={profile.adminInfo?.employeeId} />
          <InfoRow label="Designation" value={profile.adminInfo?.designation} />
          <InfoRow label="Date of Joining" value={formatDate(profile.adminInfo?.dateOfJoining)} />
          <InfoRow label="Reporting Authority" value={profile.adminInfo?.reportingAuthority} />
          <InfoRow label="System Status" value={profile.status} />
        </FormCard>
      );

    case "contact":
      return (
        <FormCard 
          title="Contact & Address" 
          isEditable={true} 
          editMode={editMode} 
          onEdit={() => setEditMode(true)} 
          onCancel={handleCancel} 
          onSave={handleSave} 
          saving={saving}
        >
          <InfoRow
            label="Alternate Mobile"
            editMode={editMode}
            value={editMode ? editData.contactInfo.alternateMobile : profile.contactInfo?.alternateMobile}
            onChange={(v) => setEditData({ ...editData, contactInfo: { ...editData.contactInfo, alternateMobile: v } })}
          />
          <InfoRow
            label="Street Address"
            editMode={editMode}
            value={editMode ? editData.contactInfo.permanentAddress?.address : profile.contactInfo?.permanentAddress?.address}
            onChange={(v) => setEditData({...editData, contactInfo: { ...editData.contactInfo, permanentAddress: { ...editData.contactInfo.permanentAddress, address: v } }})}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow
              label="City"
              editMode={editMode}
              value={editMode ? editData.contactInfo.permanentAddress?.city : profile.contactInfo?.permanentAddress?.city}
              onChange={(v) => setEditData({...editData, contactInfo: { ...editData.contactInfo, permanentAddress: { ...editData.contactInfo.permanentAddress, city: v } }})}
            />
            <InfoRow
              label="State"
              editMode={editMode}
              value={editMode ? editData.contactInfo.permanentAddress?.state : profile.contactInfo?.permanentAddress?.state}
              onChange={(v) => setEditData({...editData, contactInfo: { ...editData.contactInfo, permanentAddress: { ...editData.contactInfo.permanentAddress, state: v } }})}
            />
            <InfoRow
              label="PIN Code"
              editMode={editMode}
              value={editMode ? editData.contactInfo.permanentAddress?.pin : profile.contactInfo?.permanentAddress?.pin}
              onChange={(v) => setEditData({...editData, contactInfo: { ...editData.contactInfo, permanentAddress: { ...editData.contactInfo.permanentAddress, pin: v } }})}
            />
          </div>
        </FormCard>
      );

    case "family":
      return (
        <FormCard 
          title="Family Details" 
          isEditable={true} 
          editMode={editMode} 
          onEdit={() => setEditMode(true)} 
          onCancel={handleCancel} 
          onSave={handleSave} 
          saving={saving}
        >
          <InfoRow
            label="Father/Spouse First Name"
            editMode={editMode}
            value={editMode ? editData.familyBackground.fatherSpouseFirstName : profile.familyBackground?.fatherSpouseFirstName || profile.familyBackground?.fatherOrSpouseName}
            onChange={(v) => setEditData({ ...editData, familyBackground: { ...editData.familyBackground, fatherSpouseFirstName: v } })}
          />
          <InfoRow
            label="Father/Spouse Last Name"
            editMode={editMode}
            value={editMode ? editData.familyBackground.fatherSpouseLastName : profile.familyBackground?.fatherSpouseLastName}
            onChange={(v) => setEditData({ ...editData, familyBackground: { ...editData.familyBackground, fatherSpouseLastName: v } })}
          />
          <InfoRow
            label="Contact Number"
            editMode={editMode}
            value={editMode ? editData.familyBackground.fatherSpouseContact : profile.familyBackground?.fatherSpouseContact}
            onChange={(v) => setEditData({ ...editData, familyBackground: { ...editData.familyBackground, fatherSpouseContact: v } })}
          />
        </FormCard>
      );

    case "legal":
      return (
        <FormCard 
          title="Legal & Banking" 
          isEditable={true} 
          editMode={editMode} 
          onEdit={() => setEditMode(true)} 
          onCancel={handleCancel} 
          onSave={handleSave} 
          saving={saving}
        >
          <InfoRow
            label="Aadhar Number"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.aadharNumber : profile.legalCompliance?.aadharNumber}
            onChange={(v) => setEditData({ ...editData, legalCompliance: { ...editData.legalCompliance, aadharNumber: v } })}
          />
          <InfoRow
            label="PAN Number"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.panNumber : profile.legalCompliance?.panNumber}
            onChange={(v) => setEditData({ ...editData, legalCompliance: { ...editData.legalCompliance, panNumber: v } })}
          />
          
          <div className="py-4"><div className="h-px bg-slate-100 w-full" /></div>
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Salary Account Details</h4>
          
          <InfoRow
            label="Bank Name"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.bankDetails.bankName : profile.legalCompliance?.bankDetails?.bankName}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, bankDetails: { ...editData.legalCompliance.bankDetails, bankName: v } }})}
          />
          <InfoRow
            label="Account Name"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.bankDetails.accountHolderName : profile.legalCompliance?.bankDetails?.accountHolderName}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, bankDetails: { ...editData.legalCompliance.bankDetails, accountHolderName: v } }})}
          />
          <InfoRow
            label="Account Number"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.bankDetails.accountNumber : profile.legalCompliance?.bankDetails?.accountNumber}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, bankDetails: { ...editData.legalCompliance.bankDetails, accountNumber: v } }})}
          />
          <InfoRow
            label="IFSC Code"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.bankDetails.ifscCode : profile.legalCompliance?.bankDetails?.ifscCode}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, bankDetails: { ...editData.legalCompliance.bankDetails, ifscCode: v } }})}
          />
        </FormCard>
      );

    case "emergency":
      return (
        <FormCard 
          title="Emergency Contact" 
          isEditable={true} 
          editMode={editMode} 
          onEdit={() => setEditMode(true)} 
          onCancel={handleCancel} 
          onSave={handleSave} 
          saving={saving}
          readOnlyNotice="Please ensure your emergency contact is up-to-date and aware that they may be contacted."
        >
          <InfoRow
            label="Contact Name"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.emergencyContact.name : profile.legalCompliance?.emergencyContact?.name}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, emergencyContact: { ...editData.legalCompliance.emergencyContact, name: v } }})}
          />
          <InfoRow
            label="Relationship"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.emergencyContact.relationship : profile.legalCompliance?.emergencyContact?.relationship}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, emergencyContact: { ...editData.legalCompliance.emergencyContact, relationship: v } }})}
          />
          <InfoRow
            label="Phone Number"
            editMode={editMode}
            value={editMode ? editData.legalCompliance.emergencyContact.contact : profile.legalCompliance?.emergencyContact?.contact}
            onChange={(v) => setEditData({...editData, legalCompliance: { ...editData.legalCompliance, emergencyContact: { ...editData.legalCompliance.emergencyContact, contact: v } }})}
          />
        </FormCard>
      );

    default:
      return (
        <div className="flex items-center justify-center p-20 text-slate-400">
          Select a category from the menu to view details.
        </div>
      );
  }
};

export default EditProfile;
