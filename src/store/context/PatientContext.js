'use client'
import { createContext, useEffect, useReducer } from "react";
import Cookies from 'js-cookie';
import { SET_PATIENT } from '../action/PatientAction';
import { myPatientReducer } from '../reducer/PatientReducer';

export const PatientContext = createContext();

const PatientContextProvider = (props) => {
  const initialState = { value: { data: JSON.parse(Cookies.get('PatientData') || '[]') } };
  const [state, dispatch] = useReducer(myPatientReducer, initialState);

  const setPatient = (data) => {
    dispatch({ type: SET_PATIENT, payload: { data: data } });
  };

  useEffect(() => {
    Cookies.set('PatientData', JSON.stringify(state.value.data), { expires: 7 });
  }, [state.value.data]);

  return (
    <PatientContext.Provider value={{ state, setPatient }}>
      {props.children}
    </PatientContext.Provider>
  );
};

export default PatientContextProvider;
