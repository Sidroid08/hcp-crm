import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "../api/client";

const initialState = {
  items: [],
  stats: null,
  selected: null,
  chatDraft: null,
  chatReply: "",
  loading: false,
  error: null
};

export const fetchInteractions = createAsyncThunk("interactions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/interactions");
    return data;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const fetchStats = createAsyncThunk("interactions/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/interactions/stats");
    return data;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const createInteraction = createAsyncThunk("interactions/create", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post("/interactions", payload);
    dispatch(fetchStats());
    return data;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const updateInteraction = createAsyncThunk("interactions/update", async ({ id, payload }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.put(`/interactions/${id}`, payload);
    dispatch(fetchStats());
    return data;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const deleteInteraction = createAsyncThunk("interactions/delete", async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/interactions/${id}`);
    dispatch(fetchStats());
    return id;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const runChatLogger = createAsyncThunk("interactions/chat", async (message, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/ai/chat", { message });
    return data;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const summarizeInteraction = createAsyncThunk("interactions/summarize", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/ai/tools/log-interaction", { payload });
    return data.result;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setSelected(state, action) {
      state.selected = action.payload;
    },
    clearChatDraft(state) {
      state.chatDraft = null;
      state.chatReply = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.selected = null;
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(runChatLogger.fulfilled, (state, action) => {
        state.loading = false;
        state.chatReply = action.payload.reply;
        state.chatDraft = action.payload.draft;
      })
      .addCase(summarizeInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.chatDraft = action.payload;
      })
      .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Something went wrong";
      });
  }
});

export const { clearError, setSelected, clearChatDraft } = interactionsSlice.actions;
export default interactionsSlice.reducer;
