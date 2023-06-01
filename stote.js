import { configureStore } from '@reduxjs/toolkit';
import deleteSlice from './slices/deleteSlice';

export const store = configureStore({
  reducer: {
    deletePopup: deleteSlice,
  },
})
