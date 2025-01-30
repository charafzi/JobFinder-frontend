import {createSlice} from "@reduxjs/toolkit";
import {applyToOffer, cancelApplication, getCandidaturesByUserId} from "./candidaturesThunk";

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
        removeCandidature : (state, action)=>{
            let index = state.candidatures.find((cand)=> cand.offre.id === action.payload)

            if(index != 1){
                state.candidatures.splice(index,1);
            }
        }
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
                state.error = action.payload || 'Error occurred when trying to retrieving your applications. Please try again.';
                state.searchOffresList = [];
                state.last = true;
            })
            .addCase(applyToOffer.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(applyToOffer.fulfilled, (state,action)=>{
                state.isLoading = false;
            })
            .addCase(applyToOffer.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload || 'Error occurred when applying to this application. Please try again.';
            })
            //cancel application
          .addCase(cancelApplication.pending,(state)=>{
              state.isLoading = true;
              state.error = null;
          })
          .addCase(cancelApplication.rejected,(state,action)=>{
              state.isLoading = false;
              state.error = action.payload;
          })
          .addCase(cancelApplication.fulfilled,(state)=>{
              state.isLoading = false;
              state.error = null;
          })
    }
})

export const { clearCandidatures,removeCandidature} = CandidaturesSlice.actions;
export default CandidaturesSlice.reducer;