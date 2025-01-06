import {createSlice} from "@reduxjs/toolkit";
import {getOffresNearby} from "./mapOffresThunk";


const initialState = {
   offres : [],
    isLoading: false,
    error : null

}

const OffreSlice = createSlice({
    name : 'offres',
    initialState,
    reducers : {
        clearOffres : (state) =>{
            state.offres = [];
            state.isLoading= false;
            state.error=null;
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getOffresNearby.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getOffresNearby.fulfilled, (state,action)=>{
                state.isLoading= false;
                state.offres=action.payload
            })
            .addCase(getOffresNearby.rejected, (state,action)=>{
                state.isLoading= false;
                state.error= action.payload;
            })
    }

})

export const { clearOffres } = OffreSlice.actions;
export default OffreSlice.reducer;