import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../conf/axios";


export const fetchTicketCategories = createAsyncThunk('fetchTicketCategories',async()=>{
    try{
      const response = await axiosApi.get('/ticket/ticket-categories')
      return response.data.categories;
    }
    catch(err){
        console.log(err);
    }
})

export const ticketSlice = createSlice({
    name: 'ticket',
    initialState: {
        tickets: [],
        ticket_categories: [],
        loading: false,
        error: null,
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchTicketCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchTicketCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket_categories = action.payload;
                })
                .addCase(fetchTicketCategories.rejected, (state, action) => {
                    state.loading = false;
                    state.tickets = action.payload;
                    state.error = action.error.message;
                    })
    }
})
export default ticketSlice.reducer