import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAPI = createAsyncThunk('fetchAPI',async()=>{
    try{
    const response = await axios.get("https://fakestoreapi.com/products")
    return response.data
    }
    catch(err){
        return err;
    }
})



const test = createSlice({
    name: 'test',
    initialState: {
        data : [],
        loading: false,
        isError : false
    },
    extraReducers : (builder)=>{
        builder.addCase(fetchAPI.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(fetchAPI.fulfilled,(state,action)=>{
            state.loading = false
            state.data = action.payload
        })
        builder.addCase(fetchAPI.rejected,(state,action)=>{
            state.loading = false
            state.isError = true
        })
    }
})
export default test.reducer;