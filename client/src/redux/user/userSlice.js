import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sign In Reducers
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update Profile Reducers
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) =>{
            state.loading = true
            state.error = null
        },
        deleteUserSuccess: (state) =>{
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state) =>{
           
            state.loading = false
            state.error = action.payload
        },
        signoutSuccess: (state) =>{
            state.currentUser = null
            state.error = null
            state.loading = false
        },
    }
})

// Export all actions
export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} = userSlice.actions

export default userSlice.reducer
