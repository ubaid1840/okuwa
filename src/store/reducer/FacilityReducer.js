import { SET_Facility } from '../action/FacilityAction'

export const myFacilityReducer = (state, action) => {
  switch (action.type) {
    case SET_Facility:
      let newFacilityState = { ...state }
      newFacilityState.value.data = action.payload.data 
      return newFacilityState
      break
    default:
      return state
  }
}

