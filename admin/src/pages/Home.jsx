// import React, { useEffect, useState } from "react";
// import DynamicTable from '../components/DynamicTable'

// import axios from "axios";

// const Home = () => {
//   const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get("http://localhost:5000/admin/personal");
//       console.log(res);
      
//       setTableData(res.data);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold mb-4">Dynamic Table with Pagination</h1>
//       <DynamicTable data={tableData} pageSize={2} />
//     </div>
//   );
// };

// export default Home;


import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User from AuthProvider:", user);
    }
  }, [user]);

  return (
    <div className="bg-white">
      <h1 >Profile Page</h1>
      <p >Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}