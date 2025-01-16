import {createSlice} from "@reduxjs/toolkit";
import {getCandidaturesByUserId} from "./candidaturesThunk";

const initialState = {
    candidatures : [],
    isLoading: false,
    error : null,
    pageNo: 0,
    totalPages : null,
    last: false,
    currentPage : 0
}

const CandidaturesSlice = createSlice({
    name : 'candidatures',
    initialState : initialState,
    reducers : {
        clearCandidatures: (state)=>{
            state.candidatures = [];
            state.isLoading= false;
            state.error=null;
        },
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getCandidaturesByUserId.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(getCandidaturesByUserId.fulfilled, (state,action)=>{
                state.isLoading = false;
                if (action.payload.pageNo === 0) {
                    state.candidatures = action.payload.content;
                } else {
                    /// always we will have unique offer, so it's safe to do this
                    action.payload.content.forEach(newItem => {
                        if (!state.candidatures.some(item => item.offre.id === newItem.offre.id)) {
                            state.candidatures.push(newItem);
                        }
                    });
                }
                state.currentPage = action.payload.pageNo;
                state.totalPages = action.payload.totalPages;
                state.last = action.payload.last;
            })
            .addCase(getCandidaturesByUserId.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload || 'Une erreur est survenue';
                state.searchOffresList = [];
                state.last = true;
            })
    }
})

export const { clearCandidatures} = CandidaturesSlice.actions;
export default CandidaturesSlice.reducer;