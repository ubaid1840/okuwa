import { SET_HOSPITAL } from '../action/HospitalAction'

export const myHospitalReducer = (state, action) => {
  switch (action.type) {
    case SET_HOSPITAL:
      let newHospitalState = { ...state }
      newHospitalState.value.data = action.payload.data 
      return newHospitalState
      break
    default:
      return state
  }
}

