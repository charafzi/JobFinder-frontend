import {createSlice} from "@reduxjs/toolkit";
import {getOffresNearby} from "./mapOffresThunk";
import {searchOffres} from "./searchOffresThunk";


const initialState = {
    searchOffresList : [],
    mapOffresList : [],
    isLoading: false,
    error : null,
    params: {
        keyword: "",
        typeContrat: null,
        salaryMin: null,
        salaryMax: null,
        page: 0,
        size: 3,
        sortBy: "PUB_DATE",
        sortDirection: "DESC",
    },
    pageNo: 0,
    totalPages : null,
    last: false
}

const OffreSlice = createSlice({
    name : 'offres',
    initialState,
    reducers : {
        clearMapOffres : (state) =>{
            state.mapOffresList = [];
            state.isLoading= false;
            state.error=null;
        },
        clearSearchOffres: (state) => {
            state.searchOffresList = [];
            state.isLoading = false;
            state.error = null;
            state.last = false;
        },
        addOffreToMap : (state,action)=>{
            state.mapOffresList.push(action.payload);
        },
        setKeyword : (state,action)=>{
            state.params.keyword = action.payload;
        },
        setPage: (state,action)=>{
            const newPage = parseInt(action.payload);
            if (Number.isInteger(newPage) && newPage >= 0) {
                state.params.page = newPage;
            }
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
                state.mapOffresList=action.payload
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
                state.isLoading = false;
                if (action.payload.pageNo === 0) {
                    state.searchOffresList = action.payload.content;
                } else {
                    action.payload.content.forEach(newItem => {
                        if (!state.searchOffresList.some(item => item.id === newItem.id)) {
                            state.searchOffresList.push(newItem);
                        }
                    });
                }
                state.params.page = action.payload.pageNo;
                state.totalPages = action.payload.totalPages;
                state.last = action.payload.last;
            })
            .addCase(searchOffres.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload || 'Une erreur est survenue';
                state.searchOffresList = [];
                state.last = true;
            })
    }

})

export const { clearMapOffres,clearSearchOffres,addOffreToMap,setKeyword,setPage } = OffreSlice.actions;
export default OffreSlice.reducer;