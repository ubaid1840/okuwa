import { SET_Color } from '../action/ColorAction'

export const myColorReducer = (state, action) => {
  switch (action.type) {
    case SET_Color:
      let newColorState = { ...state }
      newColorState.value.data = action.payload.data 
      return newColorState
      break
    default:
      return state
  }
}

