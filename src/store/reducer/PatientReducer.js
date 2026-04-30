import { SET_PATIENT } from '../action/PatientAction'

export const myPatientReducer = (state, action) => {
  switch (action.type) {
    case SET_PATIENT:
      let newPatientState = { ...state }
      newPatientState.value.data = action.payload.data 
      return newPatientState
      break
    default:
      return state
  }
}

