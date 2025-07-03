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
        admin.Email === email ? { ...admin, Role: newRole } : admin
      )
    );
  };

  const handleSave = async (email, newRole) => {
    try {
      await axiosApi.put("/admin/update-role", {
        email,
        newRole,
      });
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Failed to update role");
    }
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(`http://localhost:5000/admins/${email}`);
      setAdmins((prev) => prev.filter((admin) => admin.Email !== email));
      alert("Admin deleted successfully!");
    } catch (error) {
      console.error("Failed to delete admin", error);
      alert("Failed to delete admin");
    }
  };

  if (!user || user.role !== ROLES.SUPER_ADMIN) {
    return <p>Unauthorized. Only Super Admin can access this page.</p>;
  }

  if (loading) return <p>Loading admins...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 bg-white">Assign Roles</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.Email}>
              <td className="border p-2">{admin.Name}</td>
              <td className="border p-2">{admin.Email}</td>
              <td className="border p-2">
                <select
                  value={admin.Role}
                  onChange={(e) => handleRoleChange(admin.Email, e.target.value)}
                  className="border p-1"
                >
                  {Object.values(ROLES).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleSave(admin.Email, admin.Role)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(admin.Email)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
