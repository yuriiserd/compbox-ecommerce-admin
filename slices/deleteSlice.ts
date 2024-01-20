import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type IDeleteState = {
  itemId: string;
  openPopup: boolean;
}

const initialState: IDeleteState = {
  itemId: '',
  openPopup: false
}

export const deleteSlice = createSlice({
  name: 'delete',
  initialState,
  reducers: {
    openDelete: (state) => {
      state.openPopup = true
    },
    closeDelete: (state) => {
      state.openPopup = false
    },
    toggleDelete: (state) => {
      state.openPopup = !state.openPopup
    },
    setDeleteItem: (state, action: PayloadAction<string>) => {
      state.itemId = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { openDelete, closeDelete, toggleDelete, setDeleteItem } = deleteSlice.actions

export const selectItemIdDelete = (state) => state.deletePopup.itemId;
export const selectOpenPopupDelete = (state) => state.deletePopup.openPopup;

export default deleteSlice.reducer