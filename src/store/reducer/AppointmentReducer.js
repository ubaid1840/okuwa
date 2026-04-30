import { SET_Appointment } from '../action/AppointmentAction'

export const myAppointmentReducer = (state, action) => {
  switch (action.type) {
    case SET_Appointment:
      let newAppointmentState = { ...state }
      newAppointmentState.value.data = action.payload.data 
      return newAppointmentState
      break
    default:
      return state
  }
}

