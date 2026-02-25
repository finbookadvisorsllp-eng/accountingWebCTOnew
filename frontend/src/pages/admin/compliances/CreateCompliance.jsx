import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complianceAPI } from "../../../services/api";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/AdminLayout";

const CreateCompliance = () => {
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await complianceAPI.create(form);
      toast.success("Compliance created successfully");
      navigate("/admin/compliances");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Create Compliance</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.keys(form).map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-xs font-semibold mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="submit"
            className="col-span-2 mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Compliance
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateCompliance;
