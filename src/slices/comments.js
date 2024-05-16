import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { article as articleAPI, comment as commentAPI } from '../utils/ArticleAPI';

const initialState = [];

const uniqueItemsById = (items) => Object.values(items.reduce((result, item) => {
    result[item?.id] = item;
    return result;
}, {}));


export const fetchComments = createAsyncThunk('comments/fetchComments', async (articleId) => {
    const response = await articleAPI.fetchComments(articleId);
    return response?.data?.comments || [];
});

export const fetchReplies = createAsyncThunk('comments/fetchReplies', async (params, thunkAPI) => {
    const { articleId, commentId, sortBy, lastId } = params;
    const { rejectWithValue } = thunkAPI;
    try {
        return await commentAPI.fetchReplies(articleId, commentId, sortBy, lastId) || [];
    } catch (e) {
        return rejectWithValue(e);
    }
});

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComment: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchComments.fulfilled, (state, action) => {
            return uniqueItemsById([...state, ...action.payload]);
        });
        builder.addCase(fetchComments.rejected, (state, action) => {
            // TODO: handle error
            console.error(action);
        });

        builder.addCase(fetchReplies.fulfilled, (state, action) => {
            const targetId = action.meta.arg?.commentId;
            const targetComment = state.find(({ id }) => id === targetId);

            if (targetComment) {
                const origReplies = targetComment?.replieList || [];
                targetComment.replieList = uniqueItemsById([...origReplies, ...action.payload]);
            }
        });

        builder.addCase(fetchReplies.rejected, (state, action) => {
            console.error(action);
        });
    }
});

export const { clearComment } = commentSlice.actions;

export default commentSlice.reducer;
