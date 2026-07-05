import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userToken: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  userToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state) => {
      state.userToken = 'dummy_token_' + Date.now();
      state.isLoading = false;
    },
    signOut: (state) => {
      state.userToken = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    restoreToken: (state, action: PayloadAction<string | null>) => {
      state.userToken = action.payload;
      state.isLoading = false;
    },
  },
});

export const { signIn, signOut, setLoading, restoreToken } = authSlice.actions;
export default authSlice.reducer;
