import React,{useState,useEffect} from 'react'
import axiosApi from '../../../../conf/axios';
import SearchableDynamicTable from '../../../../components/SearchableDynamicTable';

const Artist_new = () => {
    const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosApi.get("/any-under-review");

      
      setTableData(res.data.userDetails);
      console.log(res.data.userDetails);
    };

    fetchData();
  }, []);
  return (
    <div>
         <SearchableDynamicTable
        title="New Artist"
        data={tableData}
        showStatusIndicator={false}
        excludeColumns = {"createdAt,updatedAt,user_pass,step_status,reject_reason,personal_photo,location,current_step,rejected_step"}
        pageSize={10}
        detailsUrl="/ArtistNew"
      />
      
    </div>
  )
}

export default Artist_new
