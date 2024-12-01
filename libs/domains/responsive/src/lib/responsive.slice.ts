// eslint-disable-next-line @nx/enforce-module-boundaries
import { ResponsiveState } from '@beep/contracts'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RootState } from '@beep/store'
import { createSlice } from '@reduxjs/toolkit'

export const RESPONSIVE_KEY = 'responsive'

export const initialResponsiveState: ResponsiveState = {
  showLeftPane: false,
  showRightPane: false,
}

export const channelsSlice = createSlice({
  name: RESPONSIVE_KEY,
  initialState: initialResponsiveState,
  selectors: {
    leftPaneState: (state) => state.showLeftPane,
    rightPaneState: (state) => state.showRightPane

  },
  reducers: {
    toggleLeftPane(state) {
      state.showLeftPane = !state.showLeftPane
      if (state.showRightPane) {
        state.showRightPane = false
      }
    },
    toggleRightPane(state) {
      state.showRightPane = !state.showRightPane
      if (state.showLeftPane) {
        state.showLeftPane = false
      }
    },
    hidePane(state) {
      state.showLeftPane = false
      state.showRightPane = false
    }
  },
})

export const { leftPaneState, rightPaneState } = channelsSlice.selectors
export const responsiveReducer = channelsSlice.reducer
export const responsiveActions = channelsSlice.actions
export const getResponsiveState = (root: RootState) => root[RESPONSIVE_KEY]
