import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../conf/axios";

export const getProfile = createAsyncThunk('getProfile',async()=>{
    try{
        const userData = localStorage.getItem('userData');

        if (!userData) {
            throw new Error('User data not found in localStorage');
        }

        const parsedUserData = JSON.parse(userData); // Parse the string into an object
        const id = parsedUserData.artist?.id; // Use optional chaining to avoid errors if 'artist' is undefined

        if (!id) {
            throw new Error('Artist ID is not available');
        }

        const response = await axiosApi(`/artists/${id}`);
        console.log(response.data.data);

        return response.data.data;
    }
    catch(err){
        console.log(err);
    }
})

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        error: null
        },
        extraReducers : (builder)=>{
            builder.addCase(getProfile.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                });
                builder.addCase(getProfile.fulfilled, (state, action) => {
                    state.profile = action.payload;
                    state.loading = false;
                    });
                    builder.addCase(getProfile.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                        });
        }
})
export default profileSlice.reducer;