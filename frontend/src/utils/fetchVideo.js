import axiosApi from "../conf/axios";
export const fetchVideoForScreen = async (screenName) => {
  try {
    const response = await axiosApi.get(`/artist-website-configs?param=${screenName}`);
    console.log(response.data);
    if (response.data.success) {
      return response.data.data[0].value; // URL of the video
    }

    return null;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}; 

