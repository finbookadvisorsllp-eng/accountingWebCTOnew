import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { complianceAPI } from "../../../services/api";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/AdminLayout";

const EditCompliance = () => {
  const { id } = useParams(); // Mongo _id from URL (not shown in UI)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    complianceId: "",
    complianceName: "",
    typeOfCompliance: "",
    applicableEntityType: "",
    limitApplicable: "",
    description: "",
    dueDateRule: "",
    frequency: "",
  });

  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await complianceAPI.getOne(id);
        const data = res.data.data;

        setForm({
          complianceId: data.complianceId || "",
          complianceName: data.complianceName || "",
          typeOfCompliance: data.typeOfCompliance || "",
          applicableEntityType: data.applicableEntityType || "",
          limitApplicable: data.limitApplicable || "",
          description: data.description || "",
          dueDateRule: data.dueDateRule || "",
          frequency: data.frequency || "",
        });
      } catch (error) {
        toast.error("Failed to load compliance");
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await complianceAPI.update(id, form);
      toast.success("Compliance updated successfully");
      navigate("/admin/compliances");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading compliance details...
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-md shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Edit Compliance
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Compliance ID (Visible but readonly) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Compliance ID</label>
            <input
              type="text"
              name="complianceId"
              value={form.complianceId}
              readOnly
              className="border border-gray-300 bg-gray-100 px-3 py-2 rounded-md text-sm cursor-not-allowed"
            />
          </div>

          {/* Compliance Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Compliance Name</label>
            <input
              type="text"
              name="complianceName"
              value={form.complianceName}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Type of Compliance */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Type of Compliance
            </label>
            <input
              type="text"
              name="typeOfCompliance"
              value={form.typeOfCompliance}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Applicable Entity */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Type of Entity where Compliance is Applicable
            </label>
            <input
              type="text"
              name="applicableEntityType"
              value={form.applicableEntityType}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Limit */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Limit of Compliance Applicable
            </label>
            <input
              type="text"
              name="limitApplicable"
              value={form.limitApplicable}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium mb-1">
              Compliance Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Compliance Due Date
            </label>
            <input
              type="text"
              name="dueDateRule"
              value={form.dueDateRule}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Frequency */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Compliance Frequency
            </label>
            <input
              type="text"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm transition"
            >
              Update Compliance
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditCompliance;
