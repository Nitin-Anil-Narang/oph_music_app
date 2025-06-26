import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../conf/axios";

export const fetchBlockedDates = createAsyncThunk(
    'fetchBlockedDates',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            console.log("api call 1");
            const response = await axiosApi.get('/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue('Failed to fetch blocked dates');
            }
        } catch (err) {
            console.error("Error fetching blocked dates:", err);
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);

export const blockedDate = createSlice({
    name: 'blockedDate',
    initialState: {
        dates: [],
        loading: false,
        isError: false,
        errorMessage: ''
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlockedDates.pending, (state) => {
                state.loading = true;
                state.isError = false;
                state.errorMessage = '';
            })
            .addCase(fetchBlockedDates.fulfilled, (state, action) => {
                state.loading = false;
                state.dates = action.payload;  // Fixed from `state.data` to `state.dates`
            })
            .addCase(fetchBlockedDates.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;
                state.errorMessage = action.payload || 'Failed to fetch data';
            });
    }
});

export default blockedDate.reducer;
