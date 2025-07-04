import { useEffect, useState } from "react";
import axiosApi from "../conf/axios";
import { useAuth } from "../auth/AuthProvider";
import { ROLES } from "../utils/roles";

export default function AssignRoles() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const res = await axiosApi.get("/admin/personal");
      setAdmins(res.data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRoleChange = (email, newRole) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.Email === email ? { ...admin, Role: newRole, changed: true } : admin
      )
    );
  };

  const handleSave = async (email, newRole) => {
    try {
      await axiosApi.put("/admin/update-role", {
        email,
        newRole,
      });
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.Email === email ? { ...admin, changed: false } : admin
        )
      );
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Failed to update role");
    }
  };

  const handleDelete = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    try {
      await axiosApi.delete(`/admins/${email}`);
      setAdmins((prev) => prev.filter((admin) => admin.Email !== email));
      alert("Admin deleted successfully!");
    } catch (error) {
      console.error("Failed to delete admin", error);
      alert("Failed to delete admin");
    }
  };

  if (loading) return <p className="text-center text-gray-300 mt-10">Loading admins...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Assign Roles</h2>
      <div className="overflow-x-auto shadow rounded-lg bg-gray-900">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Role</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {admins.map((admin) => (
              <tr key={admin.Email} className="hover:bg-gray-800">
                <td className="px-4 py-3 whitespace-nowrap">{admin.Name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{admin.Email}</td>
                <td className="px-4 py-3">
                  <select
                    value={admin.Role}
                    onChange={(e) => handleRoleChange(admin.Email, e.target.value)}
                    className="border-gray-600 rounded p-2 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(ROLES).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleSave(admin.Email, admin.Role)}
                    disabled={!admin.changed}
                    className={`px-3 py-1 rounded text-sm font-medium transition 
                      ${admin.changed ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-300 text-gray-700 cursor-not-allowed"}`}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(admin.Email)}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
