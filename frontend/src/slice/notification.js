




import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../conf/axios";


export const fetchNotifications = createAsyncThunk('fetchNotifications',async({headers})=>{
    try{
    const response = await axiosApi.get('/notifications',{
                headers : headers
    });
    if(response.status === 200){
        return response.data.data
    }
    else{
        throw new Error(response.status)
    }
    }
    catch(err){
        console.log(err);
        throw err;
    }
});
export const updateNotifications = createAsyncThunk('updateNotifications',async({id:id,headers})=>{
    try{
        const response = await axiosApi.put(`/notifications/${id}/read`,{},{
            headers : headers
        })
        if(response.data.status == 'success'){
          return response.data.data;
        }
    }
    catch(err){
        console.log(err);
    }
})



export const notificationSlice = createSlice({
    name : 'notification',
    initialState : {
        new : [],
        earlier: [],
        loading : false,
        error : false,
        countNewNotifications : 0
    },
    extraReducers : (builder)=>{
        builder.addCase(fetchNotifications.pending,(state)=>{
            state.loading = true;
        })
        builder.addCase(fetchNotifications.fulfilled,(state,action)=>{
            state.loading = false;
            state.new = action.payload.new
            state.earlier = action.payload.earlier
            state.countNewNotifications = state.new.length;
        })
        builder.addCase(fetchNotifications.rejected,(state,action)=>{
            state.loading = false;
            state.error = true;
        })
        builder.addCase(updateNotifications.pending,(state)=>{
            state.loading = true;
        })
        builder.addCase(updateNotifications.fulfilled,(state,action)=>{
            state.loading = false;
            // state.new = action.payload.new
            // state.earlier = action.payload.earlier
            // state.countNewNotifications = state.new.length;
            if (action.payload) {
                const updatedId = action.payload.id;
                const index = state.new.findIndex((notification) => notification.id === updatedId);

                if (index !== -1) {
                    const updatedNotification = state.new.splice(index, 1)[0];
                    state.earlier.unshift(updatedNotification);
                    state.countNewNotifications = state.new.length;
                }
            }

        })
        builder.addCase(updateNotifications.rejected,(state,action)=>{
            state.loading = false;
            state.error = true;
        })
    }
})

export default notificationSlice.reducer;