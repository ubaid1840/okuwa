'use client'
import { createContext, useEffect, useReducer } from "react";
import Cookies from 'js-cookie';
import { SET_Appointment } from '../action/AppointmentAction';
import { myAppointmentReducer } from '../reducer/AppointmentReducer';

export const AppointmentContext = createContext();

const AppointmentContextProvider = (props) => {
  const initialState = { value: { data: JSON.parse(Cookies.get('AppointmentData') || '[]') } };
  const [state, dispatch] = useReducer(myAppointmentReducer, initialState);

  const setAppointment = (data) => {
    dispatch({ type: SET_Appointment, payload: { data: data } });
  };

  useEffect(() => {
    Cookies.set('AppointmentData', JSON.stringify(state.value.data), { expires: 7 });
  }, [state.value.data]);

  return (
    <AppointmentContext.Provider value={{ state, setAppointment }}>
      {props.children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContextProvider;
