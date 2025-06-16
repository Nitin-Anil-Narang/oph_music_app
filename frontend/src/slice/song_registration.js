import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../conf/axios";


export const fetchContentTypes = createAsyncThunk('fetchContentTypes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get('/content/content_types');

            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue('Failed to fetch content types');
            }
        } catch (err) {
            console.error("Error fetching content types", err);
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
)

export const fetchPaymentPlans = createAsyncThunk('fetchPaymentPlans',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get('/payments/plans');
            if (response.status === 200) {
                return response.data.data;
            } else {
                return rejectWithValue('Failed to fetch payment plans');
            }
        } catch (err) {
            console.error("Error fetching payment plans", err);
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
)

export const setPaymentPlans = createAsyncThunk('setPaymentPlans',({plans:plans})=>{
   return plans;
})

export const setContentID = createAsyncThunk('setContentID',({contentID:contentID})=>{
    return contentID;
})

export const setSongName = createAsyncThunk('setSongName',({name:name})=>{
    return name;
 })



export const addSecondaryArtist = createAsyncThunk('addSecondaryArtist',({secondary_artist:secondary_artist})=>{
    return secondary_artist;
})
export const removeSecondaryArtist = createAsyncThunk('removeSecondaryArtist',({secondary_artist:secondary_artist})=>{
    return secondary_artist.name;
})
export const addFeaturingArtist = createAsyncThunk('addFeaturingArtist',({featuring_artist:featuring_artist})=>{
    return featuring_artist;
})
export const removeFeaturingArtist = createAsyncThunk('removeFeaturingArtist',({index:index})=>{
    return index;
})
export const addLyricistArtist = createAsyncThunk('addLyricistArtist',({lyricist_artist:lyricist_artist})=>{
    return lyricist_artist;
})
export const removeLyricistArtist = createAsyncThunk('removeLyricistArtist',({index:index})=>{
    return index;
})
export const addComposerArtist = createAsyncThunk('addComposerArtist',({composer_artist:composer_artist})=>{
    return composer_artist;
})
export const removeComposerArtist = createAsyncThunk('removeComposerArtist',({index:index})=>{
    return index;
})
export const addProducerArtist = createAsyncThunk('addProducerArtist',({producer_artist:producer_artist})=>{
    return producer_artist;
})
export const removeProducerArtist = createAsyncThunk('removeProducerArtist',({index:index})=>{
    return index;
})

export const postVideoMetaData = createAsyncThunk('postVideoMetaData',async({data:data,contentID:contentID})=>{
   try{
    const response = await axiosApi.post(`/content/video-metadata/${contentID}`,data,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
    })
    return response.data;
   }
   catch(err){
     console.log(err);

   }
})
export const postAudioMetaData = createAsyncThunk('postAudioMetaData',async({data:data})=>{

})

export const songRegisterSlice = createSlice({
    name: 'songRegister',
    initialState: {
        songRegister: [],
        content_types: [],
        payment_plans: [],
        selected_payment_plans: [],
        content_id : '',
        songName: '',
        secondary_artists : [],
        featuring_artists : [

                {"name":"Raj","legal_name":"Raj"},
                {"name":"Nitesh","legal_name":"Nitet"}

        ],
        lyricist_artists : [
            {"name":"Sujal","legal_name":"Raj"},
            {"name":"Jerry","legal_name":"Nitet"}
        ],
        composer_artists : [
            {"name":"Nijale","legal_name":"Raj"},
            {"name":"Aditya","legal_name":"Nitet"}
        ],
        producer_artists : [
            {"name":"Seedorf","legal_name":"Raj"},
            {"name":"Saujan","legal_name":"Nitet"}
        ],
        isLoading: false,
        error: false,
        newSong : null
    },
    extraReducers: (builder) => {
        builder.addCase(fetchContentTypes.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(fetchContentTypes.fulfilled, (state, action) => {
            state.isLoading = false;
            state.content_types = action.payload;
            state.error = false;
        })
        builder.addCase(fetchContentTypes.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(postVideoMetaData.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(postVideoMetaData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newSong = action.payload;
            state.error = false;
        })
        builder.addCase(postVideoMetaData.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(fetchPaymentPlans.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(fetchPaymentPlans.fulfilled, (state, action) => {
            state.isLoading = false;
            state.payment_plans = action.payload;
            state.error = false;
        })
        builder.addCase(fetchPaymentPlans.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(setPaymentPlans.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(setPaymentPlans.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selected_payment_plans = action.payload;
            state.error = false;
        })
        builder.addCase(setPaymentPlans.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(setContentID.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(setContentID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.content_id = action.payload;
        })
        builder.addCase(setContentID.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(addSecondaryArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(addSecondaryArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.secondary_artists = state.secondary_artists.push(action.payload);
        })
        builder.addCase(addSecondaryArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(removeSecondaryArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(removeSecondaryArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.secondary_artists = state.secondary_artists.filter(
                (artist) => artist.name !== action.payload
            );
        })
        builder.addCase(removeSecondaryArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(addFeaturingArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(addFeaturingArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.featuring_artists = [...state.featuring_artists, action.payload];

        })
        builder.addCase(addFeaturingArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(removeFeaturingArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(removeFeaturingArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.featuring_artists = state.featuring_artists.filter(
                (artist, idx) => idx !== action.payload
              );
        })
        builder.addCase(removeFeaturingArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(addLyricistArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(addLyricistArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            // state.featuring_artists = [...state.featuring_artists, action.payload];
state.lyricist_artists = [...state.lyricist_artists, action.payload];
        })
        builder.addCase(addLyricistArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(removeLyricistArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(removeLyricistArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.lyricist_artists = state.lyricist_artists.filter(
                (artist, idx) => idx !== action.payload
              );
        })
        builder.addCase(removeLyricistArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(addComposerArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(addComposerArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            // state.composer_artists = state.composer_artists.push(action.payload);
            state.composer_artists = [...state.composer_artists, action.payload];
        })
        builder.addCase(addComposerArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(removeComposerArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(removeComposerArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.composer_artists = state.composer_artists.filter(
                (artist, idx) => idx !== action.payload
              );
        })
        builder.addCase(removeComposerArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(addProducerArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(addProducerArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            // state.producer_artists = state.producer_artists.push(action.payload);
            state.producer_artists = [...state.producer_artists, action.payload];
        })
        builder.addCase(addProducerArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(removeProducerArtist.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(removeProducerArtist.fulfilled, (state, action) => {
            state.isLoading = false;
            state.producer_artists = state.producer_artists.filter(
                (artist, idx) => idx !== action.payload
              );
        })
        builder.addCase(removeProducerArtist.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
        builder.addCase(setSongName.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        });
        builder.addCase(setSongName.fulfilled, (state, action) => {
            state.isLoading = false;
            state.songName = action.payload
        })
        builder.addCase(setSongName.rejected, (state) => {
            state.isLoading = false;
            state.error = true;
        })
    }
})

export default songRegisterSlice.reducer;