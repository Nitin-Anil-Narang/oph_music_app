import React, { useEffect, useState } from "react";
import DynamicTable from '../components/DynamicTable'
import SearchableDynamicTable from "../components/SearchableDynamicTable";

import axios from "axios";

const Home = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/newsignup");

      
      setTableData(res.data.userDetails);
      console.log(res.data.userDetails);
    };

    fetchData();
  }, []);

  
  
  

//   const data = [
//   { ophid: 1, name: "Alice", email: "alice@example.com" },
//   { ophid: 2, name: "Bob", email: "bob@example.com" },
//   { ophid: 3, name: "Charlie", email: "charlie@admin.com" },
// ];

// const statusData = [
//   { ophid: 1, status: "approved" },
//   { OPH_ID: 2, status: "approved" },
//   { ophid: 3, status: "approved" },
// ];


  return (
     <div className="p-6">
      testing home
      <h1 className="text-2xl font-bold mb-4">Users Table</h1>
      <SearchableDynamicTable
        data={tableData}
        showStatusIndicator={false}
        excludeColumns = {"createdAt,updatedAt,user_pass,step_status,reject_reason,personal_photo,location,current_step,rejected_step"}
        pageSize={10}
        detailsUrl="/newsignup"
      />
    </div>
  );
};

export default Home;



// import { useEffect } from "react";
// import { useAuth } from "../auth/AuthProvider";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "../components/Logout";

// export default function Home() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       console.log("User from AuthProvider:", user);
//     }
//   }, [user]);

//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#111] p-6 flex flex-col border-r border-gray-800">
//         <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
//         <nav className="flex flex-col gap-4">
//           <button
//             onClick={() => navigate("/home")}
//             className="hover:bg-gray-700 p-3 rounded transition text-left"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => navigate("/profile")}
//             className="hover:bg-gray-700 p-3 rounded transition text-left"
//           >
//             Profile
//           </button>
//           <button
//             onClick={() => navigate("/settings")}
//             className="hover:bg-gray-700 p-3 rounded transition text-left"
//           >
//             Settings
//           </button>
//           <button
//             onClick={() => navigate("/role_change")}
//             className="hover:bg-gray-700 p-3 rounded transition text-left"
//           >
//             Admin Management
//           </button>
//           <LogoutButton />
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10">
//         <h1 className="text-4xl font-extrabold mb-6">Profile Page</h1>
//         <div className="bg-[#222] p-6 rounded-xl shadow-lg max-w-lg">
//           <p className="mb-2">
//             <span className="font-semibold">Email:</span> {user?.email}
//           </p>
//           <p>
//             <span className="font-semibold">Role:</span> {user?.role}
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }
