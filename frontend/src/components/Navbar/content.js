import axiosApi from "../../conf/axios";
export const searchContent = async (query) => {
  try {
    const response = await axiosApi.get(`/content/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};