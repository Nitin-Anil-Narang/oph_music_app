import React,{useState,useEffect} from 'react'
import axiosApi from '../../../../conf/axios';
import SearchableDynamicTable from '../../../../components/SearchableDynamicTable';
import ArtistSidebar from '../../../../components/ArtistSidebar';

const Content_New = () => {
  const [tableData, setTableData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        console.log("calling");
        
        const res = await axiosApi.get("/under-review-songs");
        console.log("api success");
        
  
        
        setTableData(res.data.data);
        console.log(res.data.data);
      };
  
      fetchData();
    }, []);
    return (
      <div>
        <ArtistSidebar>
           <SearchableDynamicTable
          title="New Content"
          data={tableData}
          showStatusIndicator={false}
          pageSize={10}
          excludeColumns={"availability_on_music_platform, current_page,song_register_journey"}
          detailsUrl="/ContentNew"
        />
        </ArtistSidebar>
        
      </div>
    )
}

export default Content_New
