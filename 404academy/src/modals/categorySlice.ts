// categorySlice.ts (example)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await axios.get( 'http://165.232.76.61:5001/api/Categories/getall');
    // Assuming response.data is an array of { id, name }
    return response.data;
});

interface CategoryState {
    items: { id: number; name: string }[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CategoryState = {
    items: [],
    status: 'idle',
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // array of categories
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default categorySlice.reducer;

// Selector
export const selectCategories = (state: any) => state.categories.items;
