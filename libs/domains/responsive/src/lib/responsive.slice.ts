import { ResponsiveState } from "@beep/contracts"
import { createSlice } from "@reduxjs/toolkit"

export const RESPONSIVE_KEY = 'responsive'

export const initialResponsiveState: ResponsiveState = {
    showLeftPane: false,
    showRightPane: false
}

export const channelsSlice = createSlice({
    name: RESPONSIVE_KEY,
    initialState: initialResponsiveState,
    reducers: {
        manageLeftPane(state, action) {
            state.showLeftPane = action.payload
            if (state.showRightPane) {
                state.showRightPane = !state.showRightPane
            }
        },
        manageRightPane(state, action) {
            state.showRightPane = action.payload
            if (state.showLeftPane) {
                state.showLeftPane = !state.showLeftPane
            }
        }
    },
})

export const responsiveReducer = channelsSlice.reducer
export const responsiveActions = channelsSlice.actions