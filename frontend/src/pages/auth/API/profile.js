import axios from "axios";
import axiosApi from "../../../conf/axios";
import { useArtist } from "./ArtistContext";

export const getPersonalDetails = async (headers, ophid) => {
  const response = await axiosApi.get("/auth/personal-details", {
    headers, // Already in correct format
    params: { ophid },
  });
  return response.data;
};
export const loginUser = async (email, password) => {
  const response = await axiosApi.post("/auth/signin", { email, password });
  console.log(response.data);
  return response.data;
};

export const signupUser = async (formData) => {
  console.log(formData);

  const response = await axiosApi.post("/auth/signup", formData);
  return response.data;
};

export const updatePersonalDetails = async (formData, headers) => {
  const response = await axiosApi.post("/auth/personal-details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
  return response.data;
};

export const getProfessionalDetails = async (headers,ophid) => {
  const response = await axiosApi.get("/auth/professional-details", {
    headers,
    params : {ophid}
  });
  return response.data;
};

export const updateProfessionalDetails = async (formData, headers) => {
  const response = await axiosApi.post("/auth/professional-details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
  return response.data;
};

export const getDocumentationDetails = async (headers) => {
  const response = await axiosApi.get("/auth/documentation-details", {
    headers,
  });
  return response.data;
};

export const updateDocumentationDetails = async (formData, headers) => {
  const response = await axiosApi.post(
    "/auth/documentation-details",
    formData,
    {
      headers: {
        "Content-Type": "mulztipart/form-data",
        ...headers,
      },
    }
  );
  return response.data;
};

export const updateProfileImage = async (formData, headers) => {
  const response = await axiosApi.put("/auth/update-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
  return response.data;
};
