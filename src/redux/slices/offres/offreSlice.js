import {createSlice} from "@reduxjs/toolkit";
import {getOffresNearby} from "./mapOffresThunk";
import {searchOffres} from "./searchOffresThunk";


const initialState = {
    searchOffres : [],
    mapOffres : [],
    isLoading: false,
    error : null,
    params: {
        keyword: "",
        typeContrat: null,
        salaryMin: null,
        salaryMax: null,
        page: 0,
        size: 10,
        sortBy: "PUB_DATE",
        sortDirection: "ASC",
    },
    page: 0,
    size: 10,
    last: false
}

const OffreSlice = createSlice({
    name : 'offres',
    initialState,
    reducers : {
        clearMapOffres : (state) =>{
            state.mapOffres = [];
            state.isLoading= false;
            state.error=null;
        },
        clearSearchOffres: (state) => {
            state.searchOffres = [];
            state.isLoading = false;
            state.error = null;
            state.last = false;
        },
    },
    extraReducers: (builder)=>{
        builder
            // Map offers fetching
            .addCase(getOffresNearby.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getOffresNearby.fulfilled, (state,action)=>{
                state.isLoading= false;
                state.mapOffres=action.payload
            })
            .addCase(getOffresNearby.rejected, (state,action)=>{
                state.isLoading= false;
                state.error= action.payload;
            })
            // Search offers fetching
            .addCase(searchOffres.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(searchOffres.fulfilled, (state,action)=>{
                state.isLoading= false;
                state.searchOffres=[...state.searchOffres,...action.payload.content]
                state.last=action.payload.last;
            })
            .addCase(searchOffres.rejected, (state,action)=>{
                state.isLoading= false;
                state.error= action.payload;
            })
    }

})

export const { clearMapOffres,clearSearchOffres } = OffreSlice.actions;
export default OffreSlice.reducer;