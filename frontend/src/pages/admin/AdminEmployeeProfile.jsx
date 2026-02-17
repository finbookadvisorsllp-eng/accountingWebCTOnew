import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { candidateAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

const AdminUpdatePage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    designation: "",
    dateOfJoining: "",

    employeeContactInfo: {
      primaryEmail: "",
      contactNumbers: [""],
      residentialAddressWithProof: {
        address: "",
        gpsCoordinates: { latitude: "", longitude: "" },
      },
    },

    contractInfo: {
      depositAmount: "",
      depositConfirmed: false,
    },

    legalCompliance: {
      aadharNumber: "",
      panNumber: "",
    },
  });

  useEffect(() => {
    fetchCandidate();
  }, []);

  const fetchCandidate = async () => {
    try {
      const res = await candidateAPI.getCandidate(id);
      const data = res.data.data;

      setFormData({
        designation: data.adminInfo?.designation || "",
        dateOfJoining: data.adminInfo?.dateOfJoining?.slice(0, 10) || "",

        employeeContactInfo: {
          primaryEmail: data.employeeContactInfo?.primaryEmail || "",
          contactNumbers:
            data.employeeContactInfo?.contactNumbers?.length > 0
              ? data.employeeContactInfo.contactNumbers
              : [""],
          residentialAddressWithProof: {
            address:
              data.employeeContactInfo?.residentialAddressWithProof?.address ||
              "",
            gpsCoordinates: {
              latitude:
                data.employeeContactInfo?.residentialAddressWithProof
                  ?.gpsCoordinates?.latitude || "",
              longitude:
                data.employeeContactInfo?.residentialAddressWithProof
                  ?.gpsCoordinates?.longitude || "",
            },
          },
        },

        contractInfo: {
          depositAmount: data.contractInfo?.depositAmount || "",
          depositConfirmed: data.contractInfo?.depositConfirmed || false,
        },

        legalCompliance: {
          aadharNumber: data.legalCompliance?.aadharNumber || "",
          panNumber: data.legalCompliance?.panNumber || "",
        },
      });
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await candidateAPI.updateAdminFields(id, formData);
      toast.success("Admin details updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Page Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-800">
              Update Admin Details
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage employment, contact and compliance details.
            </p>
          </div>

          {/* Employment */}
          <Section title="Employment Information">
            <Grid>
              <Input
                label="Designation"
                value={formData.designation}
                onChange={(v) => setFormData({ ...formData, designation: v })}
              />
              <Input
                type="date"
                label="Date of Joining"
                value={formData.dateOfJoining}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    dateOfJoining: v,
                  })
                }
              />
            </Grid>
          </Section>

          {/* Contact */}
          <Section title="Employee Contact Info">
            <Input
              label="Primary Email"
              value={formData.employeeContactInfo.primaryEmail}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  employeeContactInfo: {
                    ...formData.employeeContactInfo,
                    primaryEmail: v,
                  },
                })
              }
            />

            <Grid>
              <Input
                label="Address"
                value={
                  formData.employeeContactInfo.residentialAddressWithProof
                    .address
                }
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    employeeContactInfo: {
                      ...formData.employeeContactInfo,
                      residentialAddressWithProof: {
                        ...formData.employeeContactInfo
                          .residentialAddressWithProof,
                        address: v,
                        gpsCoordinates:
                          formData.employeeContactInfo
                            .residentialAddressWithProof.gpsCoordinates,
                      },
                    },
                  })
                }
              />

              <Input
                label="Latitude"
                value={
                  formData.employeeContactInfo.residentialAddressWithProof
                    .gpsCoordinates.latitude
                }
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    employeeContactInfo: {
                      ...formData.employeeContactInfo,
                      residentialAddressWithProof: {
                        ...formData.employeeContactInfo
                          .residentialAddressWithProof,
                        gpsCoordinates: {
                          ...formData.employeeContactInfo
                            .residentialAddressWithProof.gpsCoordinates,
                          latitude: v,
                        },
                      },
                    },
                  })
                }
              />
            </Grid>
          </Section>

          {/* Contract */}
          <Section title="Contract Information">
            <Grid>
              <Input
                type="number"
                label="Deposit Amount"
                value={formData.contractInfo.depositAmount}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    contractInfo: {
                      ...formData.contractInfo,
                      depositAmount: v,
                    },
                  })
                }
              />
              <Checkbox
                label="Deposit Confirmed"
                checked={formData.contractInfo.depositConfirmed}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    contractInfo: {
                      ...formData.contractInfo,
                      depositConfirmed: v,
                    },
                  })
                }
              />
            </Grid>
          </Section>

          {/* Legal */}
          <Section title="Legal Compliance">
            <Grid>
              <Input
                label="Aadhar Number"
                value={formData.legalCompliance.aadharNumber}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    legalCompliance: {
                      ...formData.legalCompliance,
                      aadharNumber: v,
                    },
                  })
                }
              />
              <Input
                label="PAN Number"
                value={formData.legalCompliance.panNumber}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    legalCompliance: {
                      ...formData.legalCompliance,
                      panNumber: v,
                    },
                  })
                }
              />
            </Grid>
          </Section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-8 space-y-6">
    <h2 className="text-lg font-bold text-gray-800 border-b pb-3">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-6">{children}</div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 mt-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
);

export default AdminUpdatePage;
