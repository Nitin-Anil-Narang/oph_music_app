import React, { useEffect, useState } from "react";
import DynamicTable from '../components/DynamicTable'

import axios from "axios";

const Home = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/auth/personal");
      
      setTableData(res.data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Dynamic Table with Pagination</h1>
      <DynamicTable data={tableData} pageSize={10} />
    </div>
  );
};

export default Home;


