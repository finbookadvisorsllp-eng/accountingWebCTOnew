// import { useEffect, useState } from "react";
// import { complianceAPI } from "../../../services/api";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import AdminLayout from "../../../components/AdminLayout";

// const ViewCompliances = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     try {
//       const res = await complianceAPI.getAll();
//       setData(res.data.data);
//     } catch (err) {
//       toast.error("Failed to fetch compliances");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this compliance?")) return;

//     try {
//       await complianceAPI.remove(id);
//       toast.success("Deleted successfully");
//       fetchData();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <AdminLayout>
//       <div className="bg-white border border-gray-300 rounded-md shadow-sm p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Compliance Master
//           </h2>

//           <Link
//             to="/admin/compliances/create"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition"
//           >
//             + Add Compliance
//           </Link>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto border border-gray-300">
//           <table className="min-w-full border-collapse text-sm text-left">
//             {/* Header */}
//             <thead className="bg-gray-100 border-b border-gray-300">
//               <tr>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Compliance ID
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Compliance Name
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Type of Compliance
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Type of Entity where Compliance is Applicable
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Limit of Compliance Applicable
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Compliance Description
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Compliance Due Date
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Compliance Frequency
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 font-semibold">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             {/* Body */}
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan="9"
//                     className="text-center py-6 text-gray-500 border border-gray-300"
//                   >
//                     Loading...
//                   </td>
//                 </tr>
//               ) : data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="9"
//                     className="text-center py-6 text-gray-500 border border-gray-300"
//                   >
//                     No data available
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((item, index) => (
//                   <tr
//                     key={item._id}
//                     className={`hover:bg-gray-50 border border-gray-300 px-4 py-2 ${
//                       index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                     }`}
//                   >
//                     <td className="text-center">{item.complianceId}</td>

//                     <td className="border border-gray-300 px-4 py-2 font-medium">
//                       {item.complianceName}
//                     </td>

//                     <td className="border border-gray-300 px-4 py-2">
//                       {item.typeOfCompliance}
//                     </td>

//                     <td className="border border-gray-300 px-4 py-2">
//                       {item.applicableEntityType}
//                     </td>

//                     <td className="border border-gray-300 px-4 py-2">
//                       {item.limitApplicable || "-"}
//                     </td>

//                     <td className="border border-gray-300 px-4 py-2">
//                       {item.description || "-"}
//                     </td>

//                     <td className="border border-gray-300 px-4 py-2">
//                       {item.dueDateRule || "-"}
//                     </td>

//                     <td className="border border-gray-300 px-4 py-2">
//                       {item.frequency || "-"}
//                     </td>

//                     <td className="px-4 py-2 flex items-center justify-center space-x-2">
//                       <Link
//                         to={`/admin/compliances/edit/${item._id}`}
//                         className="text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
//                       >
//                         Edit
//                       </Link>

//                       <button
//                         onClick={() => handleDelete(item._id)}
//                         className="text-red-600 hover:underline bg-red-50 px-2 py-1 rounded"
//                       >
//                         Del
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ViewCompliances;
import { useEffect, useState } from "react";
import { complianceAPI } from "../../../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";

const ViewCompliances = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await complianceAPI.getAll();
      setData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch compliances");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this compliance?")) return;

    try {
      await complianceAPI.remove(id);
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-white border border-gray-300 rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-800">
            Compliance Master
          </h2>

          <Link
            to="/admin/compliances/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded transition"
          >
            + Add Compliance
          </Link>
        </div>

        {/* Table – full grid borders (right border now visible on every column) */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-left">
            {/* Header */}
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Compliance ID
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Compliance Name
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Type of Compliance
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Type of Entity where Compliance is Applicable
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Limit of Compliance Applicable
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Compliance Description
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Compliance Due Date
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Compliance Frequency
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="border border-gray-300 text-center py-4 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="border border-gray-300 text-center py-4 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {item.complianceId}
                    </td>

                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      {item.complianceName}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {item.typeOfCompliance}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {item.applicableEntityType}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {item.limitApplicable || "-"}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {item.description || "-"}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {item.dueDateRule || "-"}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {item.frequency || "-"}
                    </td>

                    {/* Action icons only – small & clean */}
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/compliances/edit/${item._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewCompliances;
