import { SET_Sample } from '../action/SampleAction'

export const mySampleReducer = (state, action) => {
  switch (action.type) {
    case SET_Sample:
      let newSampleState = { ...state }
      newSampleState.value.data = action.payload.data 
      return newSampleState
      break
    default:
      return state
  }
}

